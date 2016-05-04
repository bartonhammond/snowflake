/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var denodeify = require('denodeify');
var crypto = require('crypto');
var fs = require('graceful-fs');
var isAbsolutePath = require('absolute-path');
var path = require('../fastpath');
var tmpDir = require('os').tmpDir();

function getObjectValues(object) {
  return Object.keys(object).map(function (key) {
    return object[key];
  });
}

function debounce(fn, delay) {
  var timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

var Cache = function () {
  function Cache(_ref) {
    var resetCache = _ref.resetCache;
    var cacheKey = _ref.cacheKey;
    var _ref$cacheDirectory = _ref.cacheDirectory;
    var cacheDirectory = _ref$cacheDirectory === undefined ? tmpDir : _ref$cacheDirectory;

    _classCallCheck(this, Cache);

    this._cacheFilePath = Cache.getCacheFilePath(cacheDirectory, cacheKey);
    if (!resetCache) {
      this._data = this._loadCacheSync(this._cacheFilePath);
    } else {
      this._data = Object.create(null);
    }

    this._persistEventually = debounce(this._persistCache.bind(this), 2000);
  }

  _createClass(Cache, [{
    key: 'get',
    value: function get(filepath, field, loaderCb) {
      if (!isAbsolutePath(filepath)) {
        throw new Error('Use absolute paths');
      }

      return this.has(filepath, field) ? this._data[filepath].data[field] : this.set(filepath, field, loaderCb(filepath));
    }
  }, {
    key: 'invalidate',
    value: function invalidate(filepath, field) {
      if (this.has(filepath, field)) {
        if (field == null) {
          delete this._data[filepath];
        } else {
          delete this._data[filepath].data[field];
        }
      }
    }
  }, {
    key: 'end',
    value: function end() {
      return this._persistCache();
    }
  }, {
    key: 'has',
    value: function has(filepath, field) {
      return Object.prototype.hasOwnProperty.call(this._data, filepath) && (field == null || Object.prototype.hasOwnProperty.call(this._data[filepath].data, field));
    }
  }, {
    key: 'set',
    value: function set(filepath, field, loaderPromise) {
      var _this = this;

      var record = this._data[filepath];
      if (!record) {
        record = Object.create(null);
        this._data[filepath] = record;
        this._data[filepath].data = Object.create(null);
        this._data[filepath].metadata = Object.create(null);
      }

      record.data[field] = loaderPromise.then(function (data) {
        return Promise.all([data, denodeify(fs.stat)(filepath)]);
      }).then(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2);

        var data = _ref3[0];
        var stat = _ref3[1];

        _this._persistEventually();

        // Evict all existing field data from the cache if we're putting new
        // more up to date data
        var mtime = stat.mtime.getTime();
        if (record.metadata.mtime !== mtime) {
          record.data = Object.create(null);
        }
        record.metadata.mtime = mtime;

        return data;
      });

      return record.data[field];
    }
  }, {
    key: '_persistCache',
    value: function _persistCache() {
      var _this2 = this;

      if (this._persisting != null) {
        return this._persisting;
      }

      var data = this._data;
      var cacheFilepath = this._cacheFilePath;

      var allPromises = getObjectValues(data).map(function (record) {
        var fieldNames = Object.keys(record.data);
        var fieldValues = getObjectValues(record.data);

        return Promise.all(fieldValues).then(function (ref) {
          var ret = Object.create(null);
          ret.metadata = record.metadata;
          ret.data = Object.create(null);
          fieldNames.forEach(function (field, index) {
            return ret.data[field] = ref[index];
          });

          return ret;
        });
      });

      this._persisting = Promise.all(allPromises).then(function (values) {
        var json = Object.create(null);
        Object.keys(data).forEach(function (key, i) {
          // make sure the key wasn't added nor removed after we started
          // persisting the cache
          var value = values[i];
          if (!value) {
            return;
          }

          json[key] = Object.create(null);
          json[key].metadata = data[key].metadata;
          json[key].data = value.data;
        });
        return denodeify(fs.writeFile)(cacheFilepath, JSON.stringify(json));
      }).catch(function (e) {
        return console.error('[node-haste] Encountered an error while persisting cache:\n%s', e.stack.split('\n').map(function (line) {
          return '> ' + line;
        }).join('\n'));
      }).then(function () {
        _this2._persisting = null;
        return true;
      });

      return this._persisting;
    }
  }, {
    key: '_loadCacheSync',
    value: function _loadCacheSync(cachePath) {
      var ret = Object.create(null);
      var cacheOnDisk = loadCacheSync(cachePath);

      // Filter outdated cache and convert to promises.
      Object.keys(cacheOnDisk).forEach(function (key) {
        if (!fs.existsSync(key)) {
          return;
        }
        var record = cacheOnDisk[key];
        var stat = fs.statSync(key);
        if (stat.mtime.getTime() === record.metadata.mtime) {
          ret[key] = Object.create(null);
          ret[key].metadata = Object.create(null);
          ret[key].data = Object.create(null);
          ret[key].metadata.mtime = record.metadata.mtime;

          Object.keys(record.data).forEach(function (field) {
            ret[key].data[field] = Promise.resolve(record.data[field]);
          });
        }
      });

      return ret;
    }
  }], [{
    key: 'getCacheFilePath',
    value: function getCacheFilePath(tmpdir) {
      var hash = crypto.createHash('md5');

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      args.forEach(function (arg) {
        return hash.update(arg);
      });
      return path.join(tmpdir, hash.digest('hex'));
    }
  }]);

  return Cache;
}();

function loadCacheSync(cachePath) {
  if (!fs.existsSync(cachePath)) {
    return Object.create(null);
  }

  try {
    return JSON.parse(fs.readFileSync(cachePath));
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.warn('Unable to parse cache file. Will clear and continue.');
      try {
        fs.unlinkSync(cachePath);
      } catch (err) {
        // Someone else might've deleted it.
      }
      return Object.create(null);
    }
    throw e;
  }
}

module.exports = Cache;