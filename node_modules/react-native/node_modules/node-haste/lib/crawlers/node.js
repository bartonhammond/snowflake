'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var denodeify = require('denodeify');
var debug = require('debug')('ReactNativePackager:DependencyGraph');
var fs = require('graceful-fs');
var path = require('../fastpath');

var readDir = denodeify(fs.readdir);
var stat = denodeify(fs.stat);

function nodeRecReadDir(roots, _ref) {
  var ignore = _ref.ignore;
  var exts = _ref.exts;

  var queue = roots.slice();
  var retFiles = [];
  var extPattern = new RegExp('\.(' + exts.join('|') + ')$');

  function search() {
    var currDir = queue.shift();
    if (!currDir) {
      return Promise.resolve();
    }

    return readDir(currDir).then(function (files) {
      return files.map(function (f) {
        return path.join(currDir, f);
      });
    }).then(function (files) {
      return Promise.all(files.map(function (f) {
        return stat(f).catch(handleBrokenLink);
      })).then(function (stats) {
        return [
        // Remove broken links.
        files.filter(function (file, i) {
          return !!stats[i];
        }), stats.filter(Boolean)];
      });
    }).then(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2);

      var files = _ref3[0];
      var stats = _ref3[1];

      files.forEach(function (filePath, i) {
        if (ignore(filePath)) {
          return;
        }

        if (stats[i].isDirectory()) {
          queue.push(filePath);
          return;
        }

        if (filePath.match(extPattern)) {
          retFiles.push(path.resolve(filePath));
        }
      });

      return search();
    });
  }

  return search().then(function () {
    return retFiles;
  });
}

function handleBrokenLink(e) {
  debug('WARNING: error stating, possibly broken symlink', e.message);
  return Promise.resolve();
}

module.exports = nodeRecReadDir;