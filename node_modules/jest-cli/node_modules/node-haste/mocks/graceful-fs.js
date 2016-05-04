/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var fs = jest.genMockFromModule('fs');
var noop = function noop() {};

function asyncCallback(cb) {
  return function () {
    var _this = this,
        _arguments = arguments;

    setImmediate(function () {
      return cb.apply(_this, _arguments);
    });
  };
}

var mtime = {
  getTime: function getTime() {
    return Math.ceil(Math.random() * 10000000);
  }
};

fs.realpath.mockImpl(function (filepath, callback) {
  callback = asyncCallback(callback);
  var node = void 0;
  try {
    node = getToNode(filepath);
  } catch (e) {
    return callback(e);
  }
  if (node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object' && node.SYMLINK != null) {
    return callback(null, node.SYMLINK);
  }
  callback(null, filepath);
});

fs.readdirSync.mockImpl(function (filepath) {
  return Object.keys(getToNode(filepath));
});

fs.readdir.mockImpl(function (filepath, callback) {
  callback = asyncCallback(callback);
  var node = void 0;
  try {
    node = getToNode(filepath);
    if (node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object' && node.SYMLINK != null) {
      node = getToNode(node.SYMLINK);
    }
  } catch (e) {
    return callback(e);
  }

  if (!(node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object' && node.SYMLINK == null)) {
    return callback(new Error(filepath + ' is not a directory.'));
  }

  callback(null, Object.keys(node));
});

fs.readFile.mockImpl(function (filepath, encoding, callback) {
  callback = asyncCallback(callback);
  if (arguments.length === 2) {
    callback = encoding;
    encoding = null;
  }

  var node = void 0;
  try {
    node = getToNode(filepath);
    // dir check
    if (node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object' && node.SYMLINK == null) {
      callback(new Error('Error readFile a dir: ' + filepath));
    }
    return callback(null, node);
  } catch (e) {
    return callback(e);
  }
});

fs.stat.mockImpl(function (filepath, callback) {
  callback = asyncCallback(callback);
  var node = void 0;
  try {
    node = getToNode(filepath);
  } catch (e) {
    callback(e);
    return;
  }

  if (node.SYMLINK) {
    fs.stat(node.SYMLINK, callback);
    return;
  }

  if (node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object') {
    callback(null, {
      isDirectory: function isDirectory() {
        return true;
      },
      isSymbolicLink: function isSymbolicLink() {
        return false;
      },
      mtime: mtime
    });
  } else {
    callback(null, {
      isDirectory: function isDirectory() {
        return false;
      },
      isSymbolicLink: function isSymbolicLink() {
        return false;
      },
      mtime: mtime
    });
  }
});

fs.statSync.mockImpl(function (filepath) {
  var node = getToNode(filepath);

  if (node.SYMLINK) {
    return fs.statSync(node.SYMLINK);
  }

  return {
    isDirectory: function isDirectory() {
      return node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object';
    },
    isSymbolicLink: function isSymbolicLink() {
      return false;
    },
    mtime: mtime
  };
});

fs.lstatSync.mockImpl(function (filepath) {
  var node = getToNode(filepath);

  if (node.SYMLINK) {
    return {
      isDirectory: function isDirectory() {
        return false;
      },
      isSymbolicLink: function isSymbolicLink() {
        return true;
      },
      mtime: mtime
    };
  }

  return {
    isDirectory: function isDirectory() {
      return node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object';
    },
    isSymbolicLink: function isSymbolicLink() {
      return false;
    },
    mtime: mtime
  };
});

fs.open.mockImpl(function (path) {
  var callback = arguments[arguments.length - 1] || noop;
  var data = void 0,
      error = void 0,
      fd = void 0;
  try {
    data = getToNode(path);
  } catch (e) {
    error = e;
  }

  if (error || data == null) {
    error = Error('ENOENT: no such file or directory, open ' + path);
  }
  if (data != null) {
    /* global Buffer: true */
    fd = { buffer: new Buffer(data, 'utf8'), position: 0 };
  }

  callback(error, fd);
});

fs.read.mockImpl(function (fd, buffer, writeOffset, length, position) {
  var callback = arguments.length <= 5 || arguments[5] === undefined ? noop : arguments[5];

  var bytesWritten = void 0;
  try {
    if (position == null || position < 0) {
      position = fd.position;
    }
    bytesWritten = fd.buffer.copy(buffer, writeOffset, position, position + length);
    fd.position = position + bytesWritten;
  } catch (e) {
    callback(Error('invalid argument'));
    return;
  }
  callback(null, bytesWritten, buffer);
});

fs.close.mockImpl(function (fd) {
  var callback = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];

  try {
    fd.buffer = fs.position = undefined;
  } catch (e) {
    callback(Error('invalid argument'));
    return;
  }
  callback(null);
});

var filesystem = void 0;

fs.__setMockFilesystem = function (object) {
  return filesystem = object;
};

function getToNode(filepath) {
  // Ignore the drive for Windows paths.
  if (filepath.match(/^[a-zA-Z]:\\/)) {
    filepath = filepath.substring(2);
  }

  var parts = filepath.split(/[\/\\]/);
  if (parts[0] !== '') {
    throw new Error('Make sure all paths are absolute.');
  }
  var node = filesystem;
  parts.slice(1).forEach(function (part) {
    if (node && node.SYMLINK) {
      node = getToNode(node.SYMLINK);
    }
    node = node[part];
  });

  return node;
}

module.exports = fs;