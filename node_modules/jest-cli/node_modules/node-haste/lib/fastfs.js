/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var denodeify = require('denodeify');

var _require = require('events');

var EventEmitter = _require.EventEmitter;


var fs = require('graceful-fs');
var path = require('./fastpath');

var readFile = denodeify(fs.readFile);
var _stat = denodeify(fs.stat);

var NOT_FOUND_IN_ROOTS = 'NotFoundInRootsError';

var Fastfs = function (_EventEmitter) {
  _inherits(Fastfs, _EventEmitter);

  function Fastfs(name, roots, fileWatcher, _ref) {
    var ignore = _ref.ignore;
    var crawling = _ref.crawling;
    var activity = _ref.activity;

    _classCallCheck(this, Fastfs);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Fastfs).call(this));

    _this._name = name;
    _this._fileWatcher = fileWatcher;
    _this._ignore = ignore;
    _this._roots = roots.map(function (root) {
      // If the path ends in a separator ("/"), remove it to make string
      // operations on paths safer.
      if (root.endsWith(path.sep)) {
        root = root.substr(0, root.length - 1);
      }

      root = path.resolve(root);

      return new File(root, true);
    });
    _this._fastPaths = Object.create(null);
    _this._crawling = crawling;
    _this._activity = activity;
    return _this;
  }

  _createClass(Fastfs, [{
    key: 'build',
    value: function build() {
      var _this2 = this;

      return this._crawling.then(function (files) {
        var fastfsActivity = void 0;
        var activity = _this2._activity;
        if (activity) {
          fastfsActivity = activity.startEvent('Building in-memory fs for ' + _this2._name);
        }
        files.forEach(function (filePath) {
          var root = _this2._getRoot(filePath);
          if (root) {
            var newFile = new File(filePath, false);
            var dirname = filePath.substr(0, filePath.lastIndexOf(path.sep));
            var parent = _this2._fastPaths[dirname];
            _this2._fastPaths[filePath] = newFile;
            if (parent) {
              parent.addChild(newFile, _this2._fastPaths);
            } else {
              root.addChild(newFile, _this2._fastPaths);
            }
          }
        });
        if (activity) {
          activity.endEvent(fastfsActivity);
        }

        if (_this2._fileWatcher) {
          _this2._fileWatcher.on('all', _this2._processFileChange.bind(_this2));
        }
      });
    }
  }, {
    key: 'stat',
    value: function stat(filePath) {
      var _this3 = this;

      return Promise.resolve().then(function () {
        return _this3._getFile(filePath).stat();
      });
    }
  }, {
    key: 'getAllFiles',
    value: function getAllFiles() {
      var _this4 = this;

      return Object.keys(this._fastPaths).filter(function (filePath) {
        return !_this4._fastPaths[filePath].isDir;
      });
    }
  }, {
    key: 'findFilesByExts',
    value: function findFilesByExts(exts) {
      var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var ignore = _ref2.ignore;

      return this.getAllFiles().filter(function (filePath) {
        return exts.indexOf(path.extname(filePath).substr(1)) !== -1 && (!ignore || !ignore(filePath));
      });
    }
  }, {
    key: 'matchFilesByPattern',
    value: function matchFilesByPattern(pattern) {
      return this.getAllFiles().filter(function (file) {
        return file.match(pattern);
      });
    }
  }, {
    key: 'readFile',
    value: function readFile(filePath) {
      var file = this._getFile(filePath);
      if (!file) {
        throw new Error('Unable to find file with path: ' + filePath);
      }
      return file.read();
    }
  }, {
    key: 'readWhile',
    value: function readWhile(filePath, predicate) {
      var file = this._getFile(filePath);
      if (!file) {
        throw new Error('Unable to find file with path: ' + filePath);
      }
      return file.readWhile(predicate);
    }
  }, {
    key: 'closest',
    value: function closest(filePath, name) {
      for (var file = this._getFile(filePath).parent; file; file = file.parent) {
        if (file.children[name]) {
          return file.children[name].path;
        }
      }
      return null;
    }
  }, {
    key: 'fileExists',
    value: function fileExists(filePath) {
      var file = void 0;
      try {
        file = this._getFile(filePath);
      } catch (e) {
        if (e.type === NOT_FOUND_IN_ROOTS) {
          return false;
        }
        throw e;
      }

      return file && !file.isDir;
    }
  }, {
    key: 'dirExists',
    value: function dirExists(filePath) {
      var file = void 0;
      try {
        file = this._getFile(filePath);
      } catch (e) {
        if (e.type === NOT_FOUND_IN_ROOTS) {
          return false;
        }
        throw e;
      }

      return file && file.isDir;
    }
  }, {
    key: 'matches',
    value: function matches(dir, pattern) {
      var dirFile = this._getFile(dir);
      if (!dirFile.isDir) {
        throw new Error('Expected file ' + dirFile.path + ' to be a directory');
      }

      return Object.keys(dirFile.children).filter(function (name) {
        return name.match(pattern);
      }).map(function (name) {
        return path.join(dirFile.path, name);
      });
    }
  }, {
    key: '_getRoot',
    value: function _getRoot(filePath) {
      for (var i = 0; i < this._roots.length; i++) {
        var possibleRoot = this._roots[i];
        if (isDescendant(possibleRoot.path, filePath)) {
          return possibleRoot;
        }
      }
      return null;
    }
  }, {
    key: '_getAndAssertRoot',
    value: function _getAndAssertRoot(filePath) {
      var root = this._getRoot(filePath);
      if (!root) {
        var error = new Error('File ' + filePath + ' not found in any of the roots');
        error.type = NOT_FOUND_IN_ROOTS;
        throw error;
      }
      return root;
    }
  }, {
    key: '_getFile',
    value: function _getFile(filePath) {
      filePath = path.resolve(filePath);
      if (!this._fastPaths[filePath]) {
        var file = this._getAndAssertRoot(filePath).getFileFromPath(filePath);
        if (file) {
          this._fastPaths[filePath] = file;
        }
      }

      return this._fastPaths[filePath];
    }
  }, {
    key: '_processFileChange',
    value: function _processFileChange(type, filePath, rootPath, fstat) {
      var absPath = path.join(rootPath, filePath);
      if (this._ignore(absPath) || fstat && fstat.isDirectory()) {
        return;
      }

      // Make sure this event belongs to one of our roots.
      var root = this._getRoot(absPath);
      if (!root) {
        return;
      }

      if (type === 'delete' || type === 'change') {
        var file = this._getFile(absPath);
        if (file) {
          file.remove();
        }
      }

      delete this._fastPaths[path.resolve(absPath)];

      if (type !== 'delete') {
        var _file = new File(absPath, false);
        root.addChild(_file, this._fastPaths);
      }

      this.emit('change', type, filePath, rootPath, fstat);
    }
  }]);

  return Fastfs;
}(EventEmitter);

var File = function () {
  function File(filePath, isDir) {
    _classCallCheck(this, File);

    this.path = filePath;
    this.isDir = isDir;
    this.children = this.isDir ? Object.create(null) : null;
  }

  _createClass(File, [{
    key: 'read',
    value: function read() {
      if (!this._read) {
        this._read = readFile(this.path, 'utf8');
      }
      return this._read;
    }
  }, {
    key: 'readWhile',
    value: function readWhile(predicate) {
      var _this5 = this;

      return _readWhile(this.path, predicate).then(function (_ref3) {
        var result = _ref3.result;
        var completed = _ref3.completed;

        if (completed && !_this5._read) {
          _this5._read = Promise.resolve(result);
        }
        return result;
      });
    }
  }, {
    key: 'stat',
    value: function stat() {
      if (!this._stat) {
        this._stat = _stat(this.path);
      }

      return this._stat;
    }
  }, {
    key: 'addChild',
    value: function addChild(file, fileMap) {
      var parts = file.path.substr(this.path.length + 1).split(path.sep);
      if (parts.length === 1) {
        this.children[parts[0]] = file;
        file.parent = this;
      } else if (this.children[parts[0]]) {
        this.children[parts[0]].addChild(file, fileMap);
      } else {
        var dir = new File(this.path + path.sep + parts[0], true);
        dir.parent = this;
        this.children[parts[0]] = dir;
        fileMap[dir.path] = dir;
        dir.addChild(file, fileMap);
      }
    }
  }, {
    key: 'getFileFromPath',
    value: function getFileFromPath(filePath) {
      var parts = path.relative(this.path, filePath).split(path.sep);

      /*eslint consistent-this:0*/
      var file = this;
      for (var i = 0; i < parts.length; i++) {
        var fileName = parts[i];
        if (!fileName) {
          continue;
        }

        if (!file || !file.isDir) {
          // File not found.
          return null;
        }

        file = file.children[fileName];
      }

      return file;
    }
  }, {
    key: 'ext',
    value: function ext() {
      return path.extname(this.path).substr(1);
    }
  }, {
    key: 'remove',
    value: function remove() {
      if (!this.parent) {
        throw new Error('No parent to delete ' + this.path + ' from');
      }

      delete this.parent.children[path.basename(this.path)];
    }
  }]);

  return File;
}();

function _readWhile(filePath, predicate) {
  return new Promise(function (resolve, reject) {
    fs.open(filePath, 'r', function (openError, fd) {
      if (openError) {
        reject(openError);
        return;
      }

      read(fd,
      /*global Buffer: true*/
      new Buffer(512), makeReadCallback(fd, predicate, function (readError, result, completed) {
        if (readError) {
          reject(readError);
        } else {
          resolve({ result: result, completed: completed });
        }
      }));
    });
  });
}

function read(fd, buffer, callback) {
  fs.read(fd, buffer, 0, buffer.length, -1, callback);
}

function close(fd, error, result, complete, callback) {
  fs.close(fd, function (closeError) {
    return callback(error || closeError, result, complete);
  });
}

function makeReadCallback(fd, predicate, callback) {
  var result = '';
  var index = 0;
  return function readCallback(error, bytesRead, buffer) {
    if (error) {
      close(fd, error, undefined, false, callback);
      return;
    }

    var completed = bytesRead === 0;
    var chunk = completed ? '' : buffer.toString('utf8', 0, bytesRead);
    result += chunk;
    if (completed || !predicate(chunk, index++, result)) {
      close(fd, null, result, completed, callback);
    } else {
      read(fd, buffer, readCallback);
    }
  };
}

function isDescendant(root, child) {
  return child.startsWith(root);
}

module.exports = Fastfs;