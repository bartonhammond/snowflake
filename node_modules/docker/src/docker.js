// # docker.js
// ### _A simple documentation generator based on [docco](http://jashkenas.github.com/docco/)_
// **Docker** is a really simple documentation generator, which originally started out as a
// pure-javascript port of **docco**, but which eventually gained many extra little features
// which somewhat break docco's philosophy of being a quick-and-dirty thing.
//
// Docker source-code can be found on [GitHub](https://github.com/jbt/docker)
//
// Take a look at the [original docco project](http://jashkenas.github.com/docco/) to get a feel
// for the sort of functionality this provides. In short: **Markdown**-based displaying of code comments
// next to syntax-highlighted code. This page is the result of running docker against itself.
//
// The command-line usage of docker is somewhat more useful than that of docco. To use, simply run
//
// ```sh
// ./docker -i path/to/code -o path/to/docs [a_file.js a_dir]
// ```
//
// Docker will then recurse into the code root directory (or alternatively just the files
// and directories you specify) and document-ize all the files it can.
// The folder structure will be preserved in the document root.
//
// More detailed usage instructions and examples can be found in the [README](../README.md.html)
//
// ## Differences from docco
// The main differences from docco are:
//
//  - **jsDoc support**: support for **jsDoc**-style code comments, which
// is provided in a style similar to [Dox](https://github.com/visionmedia/dox). You can see some examples of
// the sort of output you get below.
//
//  - **Folder Tree** and **Heading Navigation**: collapsible sidebar with folder tree and jump-to
// heading links for easy navigation between many files and within long files.
//
//  - **Markdown File Support**: support for plain markdown files, like the [README](../README.md.html) for this project.
//
//  - **Colour Schemes**: support for multiple output colour schemes
//
//
// So let's get started!


// ## Node Modules
// Include all the necessay node modules.
var mkdirp = require('mkdirp'),
  fs = require('fs'),
  os = require('os'),
  path = require('path'),
  exec = require('child_process').exec,
  spawn = require('child_process').spawn,
  watchr = require('watchr'),
  pygmentize = require('pygmentize-bundled'),
  showdown = require('../lib/showdown').Showdown;


// Polyfill `fs.exists` for node <= 0.6
if(typeof fs.exists != 'function') fs.exists = path.exists;

/**
 * ## Docker Constructor
 *
 * Creates a new docker instance. All methods are called on one instance of this object.
 *
 * Input arguments are either
 *
 * * Object containing any of the keys `inDir`, `outDir`, `onlyUpdated`, `colourScheme`, `ignoreHidden`, `sidebarState`, `exclude`
 * * Or `indir`, `outDir`, `onlyUpdated`, `colourScheme` and `ignoreHidden` in order
 */
var Docker = module.exports = function( /* inDir, outDir, onlyUpdated, colourScheme, ignoreHidden */ ){

  if(typeof arguments[0] === 'object'){
    this.parseOpts(arguments[0]);
  }else{
    this.parseOpts({
      inDir: arguments[0],
      outDir: arguments[1],
      onlyUpdated: arguments[2],
      colourScheme: arguments[3],
      ignoreHidden: arguments[4]
    });
  }
  this.running = false;
  this.scanQueue = [];
  this.files = [];
  this.tree = {};
};

/**
 * ## Docker.prototype.parseOpts
 *
 * Parses options for this docker instance
 *
 * @param {object} opts Object containing all options fo rthis instance
 */
Docker.prototype.parseOpts = function(opts){
  var defaults = {
    inDir: path.resolve('.'),
    outDir: path.resolve('doc'),
    onlyUpdated: false,
    colourScheme: 'default',
    ignoreHidden: false,
    sidebarState: true,
    exclude: false,
    lineNums: false,
    multiLineOnly: false,
    js: [],
    css: [],
    extras: []
  };

  // Loop through and fix up any unspecified options with the defaults.
  for(var i in defaults){
    if(defaults.hasOwnProperty(i) && typeof opts[i] === 'undefined'){
      opts[i] = defaults[i];
    }
  }

  this.inDir = opts.inDir.replace(/\/$/,'');
  this.outDir = opts.outDir;
  this.onlyUpdated = !!opts.onlyUpdated;
  this.colourScheme = opts.colourScheme;
  this.ignoreHidden = !!opts.ignoreHidden;
  this.sidebarState = opts.sidebarState;
  this.lineNums = !!opts.lineNums;
  this.extraJS = opts.js || [];
  this.extraCSS = opts.css || [];
  this.multiLineOnly = !!opts.multiLineOnly;

  // Generate an exclude regex for the given pattern
  if(typeof opts.exclude === 'string'){
    this.excludePattern = new RegExp('^(' +
      opts.exclude.replace(/\./g,'\\.')
                  .replace(/\*/g, '.*')
                  .replace(/,/g, '|') +
      ')(/|$)');
  }else{
    this.excludePattern = false;
  }

  // Oh go on then. Allow American-Enligsh spelling of colour if used programmatically
  if(opts.colorScheme) opts.colourScheme = opts.colorScheme;

  // Load bundled extras
  var extrasRoot = path.resolve(__dirname, '..', 'extras');
  for(var i = 0; i < opts.extras.length; i += 1){
    var extraName = opts.extras[i];

    this.extraJS.push(path.join(extrasRoot, extraName, extraName + '.js'));
    this.extraCSS.push(path.join(extrasRoot, extraName, extraName + '.css'));
  }
};

/**
 * ## Docker.prototype.doc
 *
 * Generate documentation for a bunch of files
 *
 * @this Docker
 * @param {Array} files Array of file paths relative to the `inDir` to generate documentation for.
 */
Docker.prototype.doc = function(files){
  this.running = true;
  [].push.apply(this.scanQueue, files);

  var self = this;
  if(this.onlyUpdated){
    // Attempt to grab the existing tree if possible.
    fs.readFile(path.join(self.outDir, 'doc-filelist.js'), function(err, file){
      if(err) return self.addNextFile();

      file = file.toString().replace(/(^var tree=|;$)/g,'');
      self.tree = JSON.parse(file);

      self.addNextFile();
    });
  }else{
    this.addNextFile();
  }
};

/**
 * ## Docker.prototype.watch
 *
 * Watches the input directory for file changes and updates docs whenever a file is updated
 *
 * @param {Array} files Array of file paths relative to the `inDir` to generate documentation for.
 */
Docker.prototype.watch = function(files){
  this.watching = true;
  this.watchFiles = files;

  // Function to call when a file is changed. We put this on a timeout to account
  // for several file changes happening in quick succession.
  var uto = false, self = this;
  function update(){
    if(self.running) return (uto = setTimeout(update, 250));
    self.clean();
    self.doc(self.watchFiles);
    uto = false;
  }

  // Install watchr. The `null` here is a watchr bug - looks like he forgot to allow for exactly
  // two arguments (like in his example)
  watchr.watch({
    path: this.inDir,
    listener: function(){
      if(!uto) uto = setTimeout(update, 250);
    }
  });

  // Aaaaand, go!
  this.doc(files);
};

/**
 * ## Docker.prototype.finished
 *
 * Callback function fired when processing is finished.
 */
Docker.prototype.finished = function(){
  this.running = false;
  if(this.watching){
    // If we're in watch mode, switch "only updated files" mode on if it isn't already
    this.onlyUpdated = true;
    console.log('Done. Waiting for changes...');
  }else{
    console.log('Done.');
  }
};

/**
 * ## Docker.prototype.clean
 *
 * Clears out any instance variables so this docker can be rerun
 */
Docker.prototype.clean = function(){
  this.scanQueue = [];
  this.files = [];
};

/**
 * ## Docker.prototype.addNextFile
 *
 * Process the next file on the scan queue. If it's a directory, list all the children and queue those.
 * If it's a file, add it to the queue.
 */
Docker.prototype.addNextFile = function(){
  if(this.scanQueue.length > 0){
    var self = this, filename = this.scanQueue.shift();
    if(this.excludePattern && this.excludePattern.test(filename)){
      this.addNextFile();
      return;
    }
    var currFile = path.resolve(this.inDir, filename);
    fs.lstat(currFile, function cb(err, stat){
      if(err){
        // Something unexpected happened on the filesystem.
        // Nothing really that we can do about it, so throw it and be done with it
        throw err;
      }

      if(stat && stat.isSymbolicLink()){
        fs.readlink(currFile, function(err, link){
          if(err){
            // Something unexpected happened on the filesystem.
            // Nothing really that we can do about it, so throw it and be done with it
            throw err;
          }
          currFile = path.resolve(path.dirname(currFile), link);
          fs.exists(currFile, function(exists){
            if(!exists){
              console.error("Unable to follow symlink to " + currFile + ': file does not exist');
              self.addNextFile();
            }else{
              fs.lstat(currFile, cb);
            }
          });
        });
      }else if(stat && stat.isDirectory()){
        // Find all children of the directory and queue those
        fs.readdir(path.resolve(self.inDir, filename), function(err, list){
           if(err){
            // Something unexpected happened on the filesystem.
            // Nothing really that we can do about it, so throw it and be done with it
            throw err;
          }
          for(var i = 0; i < list.length; i += 1){
            if(self.ignoreHidden && list[i].charAt(0).match(/[\._]/)) continue;
            self.scanQueue.push(path.join(filename, list[i]));
          }
          self.addNextFile();
        });
      }else{
        self.queueFile(filename);
        self.addNextFile();
      }
    });
  }else{
    // Once we're done scanning all the files, start processing them in order.
    this.files = this.files.sort();
    this.processNextFile();
  }
};

/**
 * ## Docker.prototype.queueFile
 *
 * Queues a file for processing, and additionally stores it in the folder tree
 *
 * @param {string} filename Name of the file to queue
 */
Docker.prototype.queueFile = function(filename){
  this.files.push(filename);
};

/**
 * ## Docker.prototype.addFileToFree
 *
 * Adds a file to the file tree to show in the sidebar. This used to be in `queueFile` but
 * since we're now only deciding whether or not the file can be included at the point of
 * reading it, this has to happen later.
 *
 * @param {string} filename Name of file to add to the tree
 */
Docker.prototype.addFileToTree = function(filename){
  var pathSeparator = path.join('a', 'b').replace(/(^.*a|b.*$)/g, '');

  // Split the file's path into the individual directories
  filename = filename.replace(new RegExp('^' + pathSeparator.replace(/([\/\\])/g, '\\$1')),'');
  var bits = filename.split(pathSeparator);

  // Loop through all the directories and process the folder structure into `this.tree`.
  //
  // `this.tree` takes the format:
  // ```js
  //  {
  //    dirs: {
  //      'child_dir_name': { /* same format as tree */ },
  //      'other_child_name': // etc...
  //    },
  //    files: [
  //      'filename.js',
  //      'filename2.js',
  //      // etc...
  //    ]
  //  }
  // ```
  var currDir  = this.tree;
  for(var i = 0; i < bits.length - 1; i += 1){
    if(!currDir.dirs) currDir.dirs = {};
    if(!currDir.dirs[bits[i]])currDir.dirs[bits[i]] = {};
    currDir = currDir.dirs[bits[i]];
  }
  if(!currDir.files) currDir.files = [];

  var lastBit = bits[bits.length-1];

  if(currDir.files.indexOf(lastBit) === -1) currDir.files.push(bits[bits.length-1]);
};

/**
 * ## Docker.prototype.processNextFile
 *
 * Take the next file off the queue and process it
 */
Docker.prototype.processNextFile = function(){
  var self = this;

  // If we still have files on the queue, process the first one
  if(this.files.length > 0){
    this.generateDoc(this.files.shift(), function(){
      self.processNextFile();
    });
  }else{
    this.copySharedResources();
  }
};

/**
 * ## Docker.prototype.generateDoc
 * ### _This is where the magic happens_
 *
 * Generate the documentation for a file
 *
 * @param {string} filename File name to generate documentation for
 * @param {function} cb Callback function to execute when we're done
 */
Docker.prototype.generateDoc = function(infilename, cb){
  var self = this;
  this.running = true;
  filename = path.resolve(this.inDir, infilename);
  this.decideWhetherToProcess(filename, function(shouldProcess){
    if(!shouldProcess) return cb();
    fs.readFile(filename, 'utf-8', function(err, data){
      if(err) throw err;
      var lang = self.languageParams(filename, data);
      if(lang === false) return cb();
      self.addFileToTree(infilename);
      switch(self.languages[lang].type){
        case 'markdown':
          self.renderMarkdownHtml(data, filename, cb);
          break;
        default:
        case 'code':
          var sections = self.parseSections(data, lang);
          self.highlight(sections, lang, function(){
            self.renderCodeHtml(sections, filename, cb);
          });
          break;
      }
    });
  });
};

/**
 * ## Docker.prototype.decideWhetherToProcess
 *
 * Decide whether or not a file should be processed. If the `onlyUpdated`
 * flag was set on initialization, only allow processing of files that
 * are newer than their counterpart generated doc file.
 *
 * Fires a callback function with either true or false depending on whether
 * or not the file should be processed
 *
 * @param {string} filename The name of the file to check
 * @param {function} callback Callback function
 */
Docker.prototype.decideWhetherToProcess = function(filename, callback){

  // If we should be processing all files, then yes, we should process this one
  if(!this.onlyUpdated) return callback(true);

  // Find the doc this file would be compiled to
  var outFile = this.outFile(filename);

  // See whether the file is newer than the output
  this.fileIsNewer(filename, outFile, callback);
};

/**
 * ## Docker.prototype.fileIsNewer
 *
 * Sees whether one file is newer than another
 *
 * @param {string} file File to check
 * @param {string} otherFile File to compare to
 * @param {function} callback Callback to fire with true if file is newer than otherFile
 */
Docker.prototype.fileIsNewer = function(file, otherFile, callback){
  fs.stat(otherFile, function(err, outStat){

    // If the output file doesn't exist, then definitely process this file
    if(err && err.code == 'ENOENT') return callback(true);

    fs.stat(file, function(err, inStat){
      // Process the file if the input is newer than the output
      callback(+inStat.mtime > +outStat.mtime);
    });
  });
};

/**
 * ## Docker.prototype.parseSections
 *
 * Parse the content of a file into individual sections.
 * A section is defined to be one block of code with an accompanying comment
 *
 * Returns an array of section objects, which take the form
 * ```js
 *  {
 *    doc_text: 'foo', // String containing comment content
 *    code_text: 'bar' // Accompanying code
 *  }
 * ```
 * @param {string} data The contents of the script file
 * @param {string} language The language of the script file

 * @return {Array} array of section objects
 */
Docker.prototype.parseSections = function(data, language){
  var codeLines = data.split('\n');
  var sections = [];

  // Fetch language-specific parameters for this code file
  var params = this.languages[language];
  var section = {
    docs: '',
    code: ''
  };
  var inMultiLineComment = false;
  var multiLine = '';
  var jsDocData;

  function md(a, stripParas){
    var h = showdown.makeHtml(a.replace(/(^\s*|\s*$)/,''));
    return stripParas ? h.replace(/<\/?p>/g,'') : h;
  }

  var commentRegex = new RegExp('^\\s*' + params.comment + '\\s?');

  // Loop through all the lines, and parse into sections
  for(var i = 0; i < codeLines.length; i += 1){
    var line = codeLines[i];

    // Only match against parts of the line that don't appear in strings
    var matchable = line.replace(/(["'])((?:[^\\\1]|(?:\\\\)*?\\[^\\])*?)\1/g,'$1$1');
    if(params.literals) {
      params.literals.forEach(function(replace){
        matchable = matchable.replace(replace[0], replace[1]);
      });
    }

    if(params.multiLine){
      // If we are currently in a multiline comment, behave differently
      if(inMultiLineComment){

        // End-multiline comments should match regardless of whether they're 'quoted'
        if(line.match(params.multiLine[1])){
          // Once we have reached the end of the multiline, take the whole content
          // of the multiline comment, and parse it as jsDoc.
          inMultiLineComment = false;

          multiLine += line;

          // Replace block comment delimiters with whitespace of the same length
          // This way we can safely outdent without breaking too many things if the
          // comment has been deliberately indented. For example, the lines in the
          // followinc comment should all be outdented equally:
          //
          // ```c
          //    /* A big long multiline
          //       comment that should get
          //       outdented properly       */
          // ```
          multiLine = multiLine
            .replace(params.multiLine[0], function(a){ return Array(a.length + 1).join(' '); })
            .replace(params.multiLine[1], function(a){ return Array(a.length + 1).join(' '); });

          multiLine = this.outdent(multiLine);

          if(params.jsDoc){

            // Strip off leading * characters.
            multiLine = multiLine.replace(/^[ \t]*\*? ?/gm, "");

            jsDocData = this.parseMultiline(multiLine);

            // Put markdown parser on the data so it can be accessed in the template
            jsDocData.md = md;
            section.docs += this.jsDocTemplate(jsDocData);
          }else{
            section.docs += '\n' + multiLine + '\n';
          }
          multiLine = '';
        }else{
          multiLine += line + '\n';
        }
        continue;
      }else if(
        // We want to match the start of a multiline comment only if the line doesn't also match the
        // end of the same comment, or if a single-line comment is started before the multiline
        // So for example the following would not be treated as a multiline starter:
        // ```js
        //  alert('foo'); // Alert some foo /* Random open comment thing
        // ```
        matchable.match(params.multiLine[0]) &&
        !matchable.replace(params.multiLine[0],'').match(params.multiLine[1]) &&
        (!params.comment || !matchable.split(params.multiLine[0])[0].match(commentRegex))
      ){
        // Here we start parsing a multiline comment. Store away the current section and start a new one
        if(section.code){
          if(!section.code.match(/^\s*$/) || !section.docs.match(/^\s*$/)) sections.push(section);
          section = { docs: '', code: '' };
        }
        inMultiLineComment = true;
        multiLine = line + "\n";
        continue;
      }
    }
    if(
      !this.multiLineOnly &&
      params.comment &&
      matchable.match(commentRegex) &&
      (!params.commentsIgnore || !matchable.match(params.commentsIgnore)) &&
      !matchable.match(/#!/)
    ){
      // This is for single-line comments. Again, store away the last section and start a new one
      if(section.code){
        if(!section.code.match(/^\s*$/) || !section.docs.match(/^\s*$/)) sections.push(section);
        section = { docs: '', code: '' };
      }
      section.docs += line.replace(commentRegex, '') + '\n';
    }else if(!params.commentsIgnore || !line.match(params.commentsIgnore)){

      // If this is the first line of active code, store it in the section
      // so we can grab it for line numbers later
      if(!section.firstCodeLine){
        section.firstCodeLine = i + 1;
      }
      section.code += line + '\n';
    }
  }
  sections.push(section);
  return sections;
};

/**
 * ## Docker.prototype.parseMultline
 *
 * Parse a multiline comment for jsDoc &agrave; la [dox](https://github.com/visionmedia/dox)
 *
 * @param {string} comment The comment to parse
 * @return {object} Object containing parsed comment data
 */
Docker.prototype.parseMultiline = function(comment){
  var commentData = { tags: [], description: {} };

  if(!/^\s*@/.test(comment)){

    // Split out a summary and body from the comment
    var full = comment.split('\n@')[0];

    commentData.description.summary = full.split(/\n\s*\n\s*/)[0];
    commentData.description.body = full.split(/\n\s*\n\s*/).slice(1).join('\n\n');

  }else{

    // If the comment starts with a tag, do nothing
    commentData.description.summary = '';
    commentData.description.body = '';
  }


  // grabType function grabs the type out of an array of space-separated
  // bits, so for example we can pick up {string, optional} from the beginning
  // of a tag. `bits` is passed in as an array so we can shift and unshift
  // to remove the type from it.
  function grabType(bits){
    var type = bits.shift();
    var badChars = /[&<>"'`]/g;
    var escape = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    };

    // Carry on adding bits until we reach a closing brace
    while(bits.length && type.indexOf('}') === -1) type += bits.shift();

    // If for whatever reason the tag was of the format {type}blah without
    // the trailing space after the }, extract whatever was left over and
    // put it back onto the bits array.
    if(!/\}$/.test(type)){
      bits.unshift(type.replace(/^.*\}(.*)$/, '$1'));
      type = type.replace(/\}.*$/,'}');
    }

    function escapeChar(chr) {
      return escape[chr] || "&amp;";
    }

    type = type.replace(badChars, escapeChar);

    return type.replace(/[{}]/g,'');
  }

  // Prepend a newline here in case the comment starts with a tag
  comment = '\n' + comment;

  // If we have jsDoc-style parameters, parse them
  if(comment.indexOf('\n@') !== -1){
    var tags = comment.split('\n@').slice(1);

    // Loop through all of the tags and process the ones we support
    commentData.tags = tags.map(function(line){
      var bits = line.split(' '), tag = {};
      var tagType = tag.type = bits.shift();

      switch(tagType){
        case 'arg':
        case 'argument':
        case 'param':
          // `@param {typename} paramname Parameter description`
          if(bits[0].charAt(0) == '{') tag.types = grabType(bits).split(/ *[|,\/] */);
          tag.name = bits.shift() || '';
          tag.description = bits.join(' ');
          tag.type = 'param';
          break;

        case 'returns':
        case 'return':
          // `@return {typename} Return description`
          if(bits[0].charAt(0) == '{') tag.types = grabType(bits).split(/ *[|,\/] */);
          tag.description = bits.join(' ');
          tag.type = 'return';
          break;

        case 'type':
          // `@type {typename}`
          tag.types = grabType(bits).split(/ *[|,\/] */);
          break;

        case 'access':
        case 'api':
          // `@api public` or `@api private` etc.
          tag.visibility = bits.shift();
          tag.type = 'api';
          break;

        case 'private':
        case 'protected':
        case 'public':
          // `@public` or `@private` etc.
          tag.visibility = tagType;
          tag.type = 'api';
          break;

        case 'see':
          // `@see Title http://url` or `@see local place`
          if(/http/.test(line)){
            tag.title = bits.length > 1 ? bits.shift() : '';
            tag.url = bits.join(' ');
          }else{
            tag.local = bits.join(' ');
          }
          break;
        default:
          if(bits.length > 0 && bits[0].charAt(0) == '{') tag.types = grabType(bits).split(/ *[|,\/] */);
          tag.description = bits.join(' ');
          tag.name = tagType;
          tag.type = 'unknown';
      }

      return tag;
    });
  }

  return commentData;
};

/**
 * ## Docker.prototype.outdent
 *
 * Attempts to automatically detect indented lines in multiline comments
 * and bring them back to normal indentation level. This is to avoid markdown
 * picking up indented lines and thinking they're code
 *
 * @param {string} code The code to attempt to outdent
 * @return {string} Outdented code
 */
Docker.prototype.outdent = function(code){
  var lines = code.split('\n');
  var tabWidth = 2;
  var smallestIndent = Infinity;

  // Loop through all the lines, finding the least-indented of all of them
  for(var i = 0; i < lines.length; i += 1){
    var line = lines[i].replace(/\t/g, Array(tabWidth+1).join(' '));
    if(/^\s$/.test(line)) continue;
    var lineIndent = 0;
    while(line.length && line.charAt(0) == ' '){
      line = line.slice(1);
      lineIndent += 1;
    }

    // If the line consists entirely of whitespace, don't factor it into
    // the calculation (editors that trim trailing whitespace may make the
    // line shorter)
    if(line.length) smallestIndent = Math.min(lineIndent, smallestIndent);
  }

  // This should only happen if the input code was entirely
  // whitespace, which should never be the case
  if(!isFinite(smallestIndent)) smallestIndent = 0;

  // Now loop over lines again and outdent them by the largest possible amount
  var outLines = [];

  for(var j = 0; j < lines.length; j += 1){
    var line = lines[j].replace(/\t/g, Array(tabWidth+1).join(' '));

    // If the line was smaller than the smallestIndent it's because
    // it was entirely whitespace anyway, so we're safe to do this.
    outLines.push(line.substr(smallestIndent));
  }

  return outLines.join('\n');
};

/**
 * ## Docker.prototype.languageParams
 *
 * Provides language-specific params for a given file name.
 *
 * @param {string} filename The name of the file to test
 * @param {string} filedata The contents of the file (to check for shebang)
 * @return {object} Object containing all of the language-specific params
 */
Docker.prototype.languageParams = function(filename, filedata){

  // First try to detect the language from the file extension
  var ext = path.extname(filename);
  ext = ext.replace(/^\./, '');

  // Bit of a hacky way of incorporating .C for C++
  if(ext === '.C') return 'cpp';
  ext = ext.toLowerCase();

  var base = path.basename(filename);
  base = base.toLowerCase();

  for(var i in this.languages){
    if(!this.languages.hasOwnProperty(i)) continue;
    if(this.languages[i].extensions &&
      this.languages[i].extensions.indexOf(ext) !== -1) return i;
    if(this.languages[i].names &&
      this.languages[i].names.indexOf(base) !== -1) return i;
  }

  // If that doesn't work, see if we can grab a shebang

  var shebangRegex = /^\n*#!\s*(?:\/usr\/bin\/env)?\s*(?:[^\n]*\/)*([^\/\n]+)(?:\n|$)/;
  var match = shebangRegex.exec(filedata);
  if(match){
    for(var j in this.languages){
      if(!this.languages.hasOwnProperty(j)) continue;
      if(this.languages[j].executables && this.languages[j].executables.indexOf(match[1]) !== -1) return j;
    }
  }

  // If we still can't figure it out, give up and return false.
  return false;
};


// The language params can have the following keys:
//
//  * `name`: Name of Pygments lexer to use
//  * `comment`: String flag for single-line comments
//  * `multiline`: Two-element array of start and end flags for block comments
//  * `commentsIgnore`: Regex of comments to strip completely (don't even doc)
//  * `jsDoc`: Whether to parse multiline comments as jsDoc
//  * `type`: Either `'code'` (default) or `'markdown'` - format of page to render
//  * `literals`: Array of match/replace pairs for literals to ignore for comment matching
//
// I'm not even going to pretend that this is an exhaustive list of
// languages that Pygments can understand. This is just a list of the most
// common ones I think are necessary. If you can think of another that
// might be useful, and can find it on the [Pygments lexer page](http://pygments.org/docs/lexers/),
// then let me know and I'll add it in
Docker.prototype.languages = {
  javascript: {
    extensions: [ 'js' ],
    executables: [ 'node' ],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], commentsIgnore: /^\s*\/\/=/, jsDoc: true,
    literals: [
      [ /\/(?![\*\/])((?:[^\\\/]|(?:\\\\)*?\\[^\\])*?)\//g, '/./' ]
    ]
  },
  coffeescript: {
    extensions: [ 'coffee' ],
    names: [ 'cakefile' ],
    executables: [ 'coffee' ],
    comment: '#',  multiLine: [ /^\s*#{3}\s*$/m, /^\s*#{3}\s*$/m ], jsDoc: true,
    literals: [
      [ /\/(?![\*\/])((?:[^\\\/]|(?:\\\\)*?\\[^\\])*?)\//g, '/./' ]
    ]
  },
  livescript: {
    extensions: [ 'ls' ],
    executables: [ 'lsc' ],
    comment: '#',  multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  ruby: {
    extensions: [ 'rb', 'rbw', 'rake', 'gemspec' ],
    executables: [ 'ruby' ],
    names: [ 'rakefile' ],
    comment: '#',  multiLine: [ /\=begin/, /\=end/ ]
  },
  python: {
    extensions: [ 'py' ],
    executables: [ 'python' ],
    comment: '#' // Python has no block commments :-(
  },
  perl: {
    extensions: [ 'pl', 'pm' ],
    executables: [ 'perl' ],
    comment: '#' // Nor (really) does perl.
  },
  c: {
    extensions: [ 'c', 'h' ],
    executables: [ 'gcc' ],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  cpp: {
    extensions: [ 'cc', 'cpp' ],
    executables: [ 'g++' ],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  vbnet: {
    extensions: [ 'vb', 'vbs', 'bas' ],
    comment: "'" // No multiline
  },
  'aspx-vb': {
    extensions: [ 'asp', 'aspx', 'asax', 'ascx', 'ashx', 'asmx', 'axd' ],
    comment: "'" // No multiline
  },
  csharp: {
    extensions: [ 'cs' ],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  'aspx-cs': {
    extensions: [ 'aspx', 'asax', 'ascx', 'ashx', 'asmx', 'axd' ],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  java: {
    extensions: [ 'java' ],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  php: {
    extensions: [ 'php', 'php3', 'php4', 'php5' ],
    executables: [ 'php' ],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  actionscript: {
    extensions: [ 'as' ],
    comment: '//', multiLine: [ /\/\*/, /\*\// ]
  },
  sh: {
    extensions: [ 'sh', 'kst', 'bash' ],
    names: [ '.bashrc', 'bashrc' ],
    executables: [ 'bash', 'sh', 'zsh' ],
    comment: '#'
  },
  yaml: {
    extensions: [ 'yaml', 'yml' ],
    comment: '#'
  },
  markdown: {
    extensions: [ 'md', 'mkd', 'markdown' ],
    type: 'markdown'
  },
  sass: {
    extensions: [ 'sass' ],
    comment: '//' //, multiLine: [ /\/\*/, /\*\// ]
  },
  scss: {
    extensions: [ 'scss' ],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  make: {
    names: [ 'makefile' ],
    comment: '#'
  },
  apache: {
    names: [ '.htaccess', 'apache.conf', 'apache2.conf' ],
    comment: '#'
  },
  jade: {
    extensions: ['jade'],
    comment: '//-?', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  groovy: {
    extensions: ['groovy'],
    comment: '//', multiLine: [ /\/\*\*?/, /\*\// ], jsDoc: true
  },
  gsp: {
    extensions: [ 'gsp' ],
    //comment: '//', gsp only supports multiline comments.
    multiLine: [ /<%--/, /--%>/ ],
    pygment: "html"// .gsp is grails server pages in pygments, html is close enough.
  },
  styl: {
    extensions: [ 'styl' ],
    comment: '//', multiLine: [ /\/\*/, /\*\// ],
    pygment: "sass"// .styl isn't supported by pygments, sass is close enough.
  },
  css: {
    extensions: [ 'css' ],
    multiLine: [ /\/\*/, /\*\// ],       // for when we detect multi-line comments
    commentStart: '/*', commentEnd: '*/' // for when we add multi-line comments
  },
  html: {
    extensions: [ 'html', 'htm' ],
    multiLine: [ /<!--/, /-->/ ],
    commentStart: '<!--', commentEnd: '-->'
  }
};

/**
 * ## Docker.prototype.pygments
 *
 * Runs a given block of code through pygments
 *
 * @param {string} data The code to give to Pygments
 * @param {string} language The name of the Pygments lexer to use
 * @param {function} cb Callback to fire with Pygments output
 */
Docker.prototype.pygments = function(data, language, cb){
  // By default tell Pygments to guess the language, and if
  // we have a language specified then tell pygments to use that lexer
  var pygOpts = {
    format: 'html',
    options: {
      encoding: 'utf-8',
      tabsize: 2,
      style: this.colourScheme
    }
  };

  if(language) pygOpts['lang'] = language;

  // run pygmentize
  pygmentize(pygOpts, data, function(err, result) {
    if (err) {
      console.error(err.toString());
      return;
    }

    cb(result.toString());
  });
};

/**
 * ## Docker.prototype.highlight
 *
 * Highlights all the sections of a file using **pygments**
 * Given an array of section objects, loop through them, and for each
 * section generate pretty html for the comments and the code, and put them in
 * `docHtml` and `codeHtml` respectively
 *
 * @param {Array} sections Array of section objects
 * @param {string} language Language ith which to highlight the file
 * @param {function} cb Callback function to fire when we're done
 */
Docker.prototype.highlight = function(sections, language, cb){
  var params = this.languages[language], self = this, pygment = language;

  var input = [];
  for(var i = 0; i < sections.length; i += 1){
    input.push(sections[i].code);
  }
  // If the language we are parsing doesn't have single line comments
  // (like HTML and CSS) we use a multi-line comment.
  if (params.comment) {
    input = input.join('\n' + params.comment + '----DIVIDER----\n');
  } else {
    input = input.join('\n' + params.commentStart + '----DIVIDER----' + params.commentEnd + '\n');
  }

  if(this.languages[language].pygment) {
      pygment = this.languages[language].pygment
  }

  // Run our input through pygments, then split the output back up into its constituent sections
  this.pygments(input, pygment, function(out){
    out = out.replace(/^\s*<div class="highlight"><pre>/,'').replace(/<\/pre><\/div>\s*$/,'');
    var bits = out.split(/^<span[^>]*>[^<]+(?:<\/span><span[^>]*>)?----DIVIDER----[^<]*<\/span>$/gm);
    for(var i = 0; i < sections.length; i += 1){
      sections[i].codeHtml = '<div class="highlight"><pre>' + bits[i] + '</pre></div>';
      sections[i].docHtml = showdown.makeHtml(sections[i].docs);
    }
    self.processDocCodeBlocks(sections, cb);
  });
};

/**
 * ## Docker.prototype.processDocCodeBlocks
 *
 * Goes through all the HTML generated from comments, finds any code blocks
 * and highlights them
 *
 * @param {Array} sections Sections array as above
 * @param {function} cb Callback to fire when done
 */
Docker.prototype.processDocCodeBlocks = function(sections, cb){
  var i = 0, self = this;

  function next(){
    // If we've reached the end of the sections array, we've highlighted everything,
    // so we can stop and fire the callback
    if(i == sections.length) return cb();

    // Process the code blocks on this section, each time returning the html
    // and moving onto the next section when we're done
    self.extractDocCode(sections[i].docHtml, function(html){
      sections[i].docHtml = html;
      i = i + 1;
      next();
    });
  }

  // Start off with the first section
  next();
};

/**
 * ## Docker.prototype.extractDocCode
 *
 * Extract and highlight code blocks in formatted HTML output from showdown
 *
 * @param {string} html The HTML to process
 * @param {function} cb Callback function to fire when done
 */
Docker.prototype.extractDocCode = function(html, cb){

  // We'll store all extracted code blocks, along with information, in this array
  var codeBlocks = [];

  // Search in the HTML for any code tag with a language set (in the format that showdown returns)
  html = html.replace(/<pre><code(\slanguage='([a-z]*)')?>([^<]*)<\/code><\/pre>/g, function(wholeMatch, langBlock, language, block){
    if(langBlock === '' || language === '') return "<div class='highlight'>" + wholeMatch + '</div>';
    // Unescape these HTML entities because they'll be re-escaped by pygments
    block = block.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&');

    // Store the code block away in `codeBlocks` and leave a flag in the original text.
    return "\n\n~C" + codeBlocks.push({
      language: language,
      code: block,
      i: codeBlocks.length + 1
    }) + "C\n\n";
  });

  // Once we're done with that, now we can move on to highlighting the code we've extracted
  this.highlighExtractedCode(html, codeBlocks, cb);
};

/**
 * ## Docker.prototype.highlightExtractedCode
 *
 * Loops through all extracted code blocks and feeds them through pygments
 * for code highlighting. Unfortunately the only way to do this that's able
 * to cater for all situations is to spawn a new pygments process for each
 * code block (as different blocks might be in different languages). If anyone
 * knows of a more efficient way of doing this, please let me know.
 *
 * @param {string} html The HTML the code has been extracted from
 * @param {Array} codeBlocks Array of extracted code blocks as above
 * @param {function} cb Callback to fire when we're done with processed HTML
 */
Docker.prototype.highlighExtractedCode = function(html, codeBlocks, cb){

  var self = this;

  function next(){
    // If we're done, then stop and fire the callback
    if(codeBlocks.length === 0)return cb(html);

    // Pull the next code block off the beginning of the array
    var nextBlock = codeBlocks.shift();

    // Run the code through pygments
    self.pygments(nextBlock.code, nextBlock.language, function(out){
      out = out.replace(/<pre>/,'<pre><code>').replace(/<\/pre>/,'</code></pre>');
      html = html.replace('\n~C' + nextBlock.i + 'C\n', out);
      next();
    });
  }

  // Fire off on first block
  next();
};

/**
 * ## Docker.prototype.addAnchors
 *
 * Automatically assign an id to each section based on any headings.
 *
 * @param {object} section The section object to look at
 * @param {number} idx The index of the section in the whole array.
 */
Docker.prototype.addAnchors = function(docHtml, idx, headings){
  var ids = {};
  if(docHtml.match(/<h[0-9]>/)){
    // If there is a heading tag, pick out the first one (likely the most important), sanitize
    // the name a bit to make it more friendly for IDs, then use that
    docHtml = docHtml.replace(/(<h([0-9])>)(.*)(<\/h\2>)/g, function(a, start, level, middle, end){
      var id = encodeURIComponent(middle.replace(/<[^>]*>/g,'').toLowerCase());
      var headingId = id;

      if(typeof ids[id] === 'undefined'){
        ids[id] = 0;
      }else{
        ids[id]++;
        headingId = id + '_' + ids[id];
      }

      headings.push({ id: id, headingId: headingId, text: middle.replace(/<[^>]*>/g,''), level: level });
      return '\n<div class="pilwrap" id="' + headingId + '">\n  '+
                start +
                '\n    <a href="#' + headingId + '" name="' + headingId + '" class="pilcrow">&#182;</a>\n    ' +
                middle + '\n  ' +
                end +
              '\n</div>\n';
    });
  }else{
    // If however we can't find a heading, then just use the section index instead.
    docHtml = '\n<div class="pilwrap">' +
              '\n  <a class="pilcrow" href="#section-' + (idx+1)+ '" id="section-' +(idx + 1) +'">&#182;</a>' +
              '\n</div>\n' + docHtml;
  }
  return docHtml;
};

/**
 * ## Docker.prototype.addLineNumbers
 *
 * Adds line numbers to rendered code HTML
 *
 * @param {string} html The code HTML
 * @param {number} first Line number of the first code line
 */
Docker.prototype.addLineNumbers = function(html, first){
  html = html.replace(/^<div class="highlight"><pre>/, '');
  html = html.replace(/<\/pre><\/div>$/, '');

  var lines = html.split('\n');

  var out = [];
  var line = first;

  for(var i = 0; i < lines.length; i += 1){
    out.push('<a class="line-num" href="#line-' + line + '" id="line-' + line + '">' + line + '</a>  ' + lines[i]);

    line += 1;
  }

  return '<div class="highlight"><pre>' + out.join('\n') + '</pre></div>';
};

/**
 * ## Docker.prototype.renderCodeHtml
 *
 * Given an array of sections, render them all out to a nice HTML file
 *
 * @param {Array} sections Array of sections containing parsed data
 * @param {string} filename Name of the file being processed
 * @param {function} cb Callback function to fire when we're done
 */
Docker.prototype.renderCodeHtml = function(sections, filename, cb){

  // Decide which path to store the output on.
  var outFile = this.outFile(filename);

  var headings = [];

  // Calculate the location of the input root relative to the output file.
  // This is necessary so we can link to the stylesheet in the output HTML using
  // a relative href rather than an absolute one
  var outDir = path.dirname(outFile);
  var pathSeparator = path.join('a', 'b').replace(/(^.*a|b.*$)/g, '');
  var relativeOut = path.resolve(outDir)
                    .replace(path.resolve(this.outDir),'')
                    .replace(/^[\/\\]/,'');
  var levels = relativeOut === '' ? 0 : relativeOut.split(pathSeparator).length;
  var relDir = Array(levels + 1).join('../');

  for(var i = 0; i < sections.length; i += 1){
    sections[i].docHtml = this.addAnchors(sections[i].docHtml, i, headings);

    if(this.lineNums) sections[i].codeHtml = this.addLineNumbers(sections[i].codeHtml, sections[i].firstCodeLine);
  }

  // Render the html file using our template
  var content = this.codeFileTemplate({
    title: path.basename(filename),
    sections: sections
  });
  var html = this.renderTemplate({
    title: path.basename(filename),
    relativeDir: relDir,
    content: content,
    headings: headings,
    sidebar: this.sidebarState,
    colourScheme: this.colourScheme,
    filename: filename.replace(this.inDir,'').replace(/^[\/\\]/,''),
    js: this.extraJS.map(path.basename),
    css: this.extraCSS.map(path.basename)
  });

  var self = this;

  // Recursively create the output directory, clean out any old version of the
  // output file, then save our new file.
  this.writeFile(outFile, html, 'Generated: ' + outFile.replace(self.outDir,''), cb);
};

/**
 * ## Docker.prototype.renderMarkdownHtml
 *
 * Renders the output for a Markdown file into HTML
 *
 * @param {string} content The markdown file content
 * @param {string} filename Name of the file being processed
 * @param {function} cb Callback function to fire when we're done
 */
Docker.prototype.renderMarkdownHtml = function(content, filename, cb){
  // Run the markdown through *showdown*
  content = showdown.makeHtml(content);

  this.extractDocCode(content, function(content){

    var headings = [];

    // Add anchors to all headings
    content = this.addAnchors(content,0, headings);

    // Wrap up with necessary classes
    content = '<div class="docs markdown">' + content + '</div>';

    // Decide which path to store the output on.
    var outFile = this.outFile(filename);

    // Calculate the location of the input root relative to the output file.
    // This is necessary so we can link to the stylesheet in the output HTML using
    // a relative href rather than an absolute one
    var outDir = path.dirname(outFile);
    var pathSeparator = path.join('a', 'b').replace(/(^.*a|b.*$)/g, '');
    var relativeOut = path.resolve(outDir)
                      .replace(path.resolve(this.outDir),'')
                      .replace(/^[\/\\]/,'');
    var levels = relativeOut == '' ? 0 : relativeOut.split(pathSeparator).length;
    var relDir = Array(levels + 1).join('../');

    // Render the html file using our template
    var html = this.renderTemplate({
      title: path.basename(filename),
      relativeDir: relDir,
      content: content,
      headings: headings,
      colourScheme: this.colourScheme,
      sidebar: this.sidebarState,
      filename: filename.replace(this.inDir,'').replace(/^[\\\/]/,''),
      js: this.extraJS.map(path.basename),
      css: this.extraCSS.map(path.basename)
    });

    // Recursively create the output directory, clean out any old version of the
    // output file, then save our new file.
    this.writeFile(outFile, html, 'Generated: ' + outFile.replace(this.outDir,''), cb);
  }.bind(this));
};

/**
 * ## Docker.prototype.copySharedResources
 *
 * Copies the shared CSS and JS files to the output directories
 */
Docker.prototype.copySharedResources = function(){
  var self = this;

  var toDo = 3;
  function done(){
    if(!--toDo){
      self.finished();
    }
  }

  fs.readFile(path.join(path.dirname(__filename),'..','res','script.js'), function(err, file){
    self.writeFileIfDifferent(
      path.join(self.outDir, 'doc-script.js'),
      file,
      'Copied JS to doc-script.js',
      done
    );
  });

  // {{{ create css file with pygmentize
  var pygOpts = {
    format: 'html',
    options: {
      full: true,
      style: this.colourScheme
    }
  };

  fs.readFile(path.join(path.dirname(__filename),'..','res','css', self.colourScheme + '.css'), function(err, file){
    if (err) {
      console.error('Error reading base CSS:\n', err);
      process.exit();
    }
    pygmentize(pygOpts, '', function(err, result) {
      if (err) {
        console.error('Error generating CSS:\n', err);
        process.exit();
      }

      // extract css
      result = result.toString().match(/<style type="text\/css">([\S\s]*)<\/style>/)[1];
      // add selector prefix
      result = result.replace(/\nbody /g, '\nbody .highlight ');

      // save combined file
      self.writeFileIfDifferent(
        path.join(self.outDir, 'doc-style.css'),
        file.toString() + result,
        'Copied ' + self.colourScheme + '.css to doc-style.css',
        done
      );
    });

  });
  // }}}


  self.writeFileIfDifferent(
    path.join(self.outDir, 'doc-filelist.js'),
    'var tree=' + JSON.stringify(self.tree) + ';',
    'Saved file tree to doc-filelist.js',
    done
  );

  var extras = self.extraJS.concat(self.extraCSS);

  for(var i = 0; i < extras.length; i += 1){
    toDo += 1;
    self.copyExtraFile(extras[i], done);
  }
};

/**
 * ## Docker.prototype.copyExtraFile
 *
 * Copies an additional JS or CSS file to the output
 *
 * @param {string} filename Path (relative to pwd) to the file
 * @param {function} cb Callback to fire when done
 */
Docker.prototype.copyExtraFile = function(filename, cb){
  var self = this;
  var fn = path.basename(filename);
  fs.readFile(path.resolve(filename), function(err, file){
    self.writeFileIfDifferent(
      path.join(self.outDir, fn),
      file,
      'Copied ' + fn,
      cb
    );
  });
};

/**
 * ## Docker.prototype.outFile
 *
 * Generates the output path for a given input file
 *
 * @param {string} filename Name of the input file
 * @return {string} Name to use for the generated doc file
 */
Docker.prototype.outFile = function(filename){

  return path.normalize(filename.replace(path.resolve(this.inDir), this.outDir) + '.html');
};

/**
 * ## Docker.prototype.compileTemplate
 *
 * Tiny template compilation function
 *
 * @param {string} str Template content
 * @return {function} Compiled template function
 */
Docker.prototype.compileTemplate = function(str){
  return new Function('obj', 'var p=[],print=function(){p.push.apply(p,arguments);};' +
    'with(obj){p.push(\'' +
    str.replace(/[\r\t]/g, " ")
       .replace(/(>)\s*\n+(\s*<)/g,'$1\n$2')
       .replace(/(?=<%[^=][^%]*)%>\s*\n*\s*<%(?=[^=])/g,'')
       .replace(/%>\s*(?=\n)/g,'%>')
       .replace(/(?=\n)\s*<%/g,'<%')
       .replace(/\n/g,"~K")
       .replace(/~K(?=[^%]*%>)/g, " ")
       .replace(/~K/g, '\\n')
       .replace(/'(?=[^%]*%>)/g, "\t")
       .split("'").join("\\'")
       .split("\t").join("'")
       .replace(/<%=(.+?)%>/g, "',$1,'")
       .split('<%').join("');")
       .split('%>').join("p.push('") +
    "');}return p.join('');");
};

/**
 * ## Docker.prototype.renderTemplate
 *
 * Renders the HTML for an output page with given parameters
 *
 * @param {object} obj Object containing parameters for the template
 * @return {string} Rendered doc page
 */
Docker.prototype.renderTemplate = function(obj){
  // If we haven't already loaded the template, load it now.
  // It's a bit messy to be using readFileSync I know, but this
  // is the easiest way for now.
  if(!this.__tmpl){
    var tmplFile = path.join(path.dirname(__filename),'..','res','tmpl.jst');
    this.__tmpl = this.compileTemplate(fs.readFileSync(tmplFile).toString());
  }
  return this.__tmpl(obj);
};

/**
 * ## Docker.prototype.codeFileTemplate
 *
 * Renders the content for a code file's doc page
 *
 * @param {object} obj Object containing parameters for the template
 * @return {string} Rendered content
 */
Docker.prototype.codeFileTemplate = function(obj){
  if(!this.__codeTmpl){
    var tmplFile = path.join(path.dirname(__filename),'..','res','code.jst');
    this.__codeTmpl = this.compileTemplate(fs.readFileSync(tmplFile).toString());
  }
  return this.__codeTmpl(obj);
};

/**
 * ## Docker.prototype.jsDocTemplate
 *
 * Renders parsed multiline commend data into a format suitable for compilation
 *
 * @param {object} obj Object containing parsed multiline comment data
 * @return {string} Rendered output of comment properties
 */
Docker.prototype.jsDocTemplate = function(obj){
  if(!this.__jsdoctmpl){
    var tmplFile = path.join(path.dirname(__filename), '..','res','jsDoc.jst');
    this.__jsdoctmpl = this.compileTemplate(fs.readFileSync(tmplFile).toString());
  }
  return this.__jsdoctmpl(obj);
};

/**
 * ## Docker.prototype.writeFile
 *
 * Saves a file, making sure the directory already exists and overwriting any existing file
 *
 * @param {string} filename The name of the file to save
 * @param {string} fileContent Content to save to the file
 * @param {string} doneLog String to console.log when done
 * @param {function} doneCallback Callback to fire when done
 */
Docker.prototype.writeFile = function(filename, fileContent, doneLog, doneCallback){
  var outDir = path.dirname(filename);
  mkdirp(outDir, function(){
    fs.unlink(filename, function(){
      fs.writeFile(filename, fileContent, function(){
        if(doneLog) console.log(doneLog);
        if(doneCallback) doneCallback();
      });
    });
  });
};

/**
 * ## Docker.prototype.writeFileIfDifferent
 *
 * Saves a fileas above, but only if the file's contents are to be changed
 *
 * @param {string} filename The name of the file to save
 * @param {string} fileContent Content to save to the file
 * @param {string} doneLog String to console.log when done
 * @param {function} doneCallback Callback to fire when done
 */
Docker.prototype.writeFileIfDifferent = function(filename, fileContent, doneLog, doneCallback){
  var outDir = path.dirname(filename);
  fs.readFile(filename, function(err, content){
    if(!err && content.toString() === fileContent.toString()){
      if(doneCallback) doneCallback();
      return;
    }
    mkdirp(outDir, function(){
      fs.unlink(filename, function(){
        fs.writeFile(filename, fileContent, function(){
          if(doneLog) console.log(doneLog);
          if(doneCallback) doneCallback();
        });
      });
    });
  });
};
