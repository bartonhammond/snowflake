/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var crypto = require('crypto');
var docblock = require('./DependencyGraph/docblock');
var isAbsolutePath = require('absolute-path');
var jsonStableStringify = require('json-stable-stringify');
var path = require('./fastpath');
var extractRequires = require('./lib/extractRequires');

var Module = function () {
  function Module(_ref) {
    var file = _ref.file;
    var fastfs = _ref.fastfs;
    var moduleCache = _ref.moduleCache;
    var cache = _ref.cache;
    var _ref$extractor = _ref.extractor;
    var extractor = _ref$extractor === undefined ? extractRequires : _ref$extractor;
    var transformCode = _ref.transformCode;
    var depGraphHelpers = _ref.depGraphHelpers;

    _classCallCheck(this, Module);

    if (!isAbsolutePath(file)) {
      throw new Error('Expected file to be absolute path but got ' + file);
    }

    this.path = file;
    this.type = 'Module';

    this._fastfs = fastfs;
    this._moduleCache = moduleCache;
    this._cache = cache;
    this._extractor = extractor;
    this._transformCode = transformCode;
    this._depGraphHelpers = depGraphHelpers;
  }

  _createClass(Module, [{
    key: 'isHaste',
    value: function isHaste() {
      var _this = this;

      return this._cache.get(this.path, 'isHaste', function () {
        return _this._readDocBlock().then(function (_ref2) {
          var id = _ref2.id;
          return !!id;
        });
      });
    }
  }, {
    key: 'getCode',
    value: function getCode(transformOptions) {
      return this.read(transformOptions).then(function (_ref3) {
        var code = _ref3.code;
        return code;
      });
    }
  }, {
    key: 'getMap',
    value: function getMap(transformOptions) {
      return this.read(transformOptions).then(function (_ref4) {
        var map = _ref4.map;
        return map;
      });
    }
  }, {
    key: 'getName',
    value: function getName() {
      var _this2 = this;

      return this._cache.get(this.path, 'name', function () {
        return _this2._readDocBlock().then(function (_ref5) {
          var id = _ref5.id;

          if (id) {
            return id;
          }

          var p = _this2.getPackage();

          if (!p) {
            // Name is full path
            return _this2.path;
          }

          return p.getName().then(function (name) {
            if (!name) {
              return _this2.path;
            }

            return path.join(name, path.relative(p.root, _this2.path)).replace(/\\/g, '/');
          });
        });
      });
    }
  }, {
    key: 'getPackage',
    value: function getPackage() {
      return this._moduleCache.getPackageForModule(this);
    }
  }, {
    key: 'getDependencies',
    value: function getDependencies(transformOptions) {
      return this.read(transformOptions).then(function (data) {
        return data.dependencies;
      });
    }
  }, {
    key: 'invalidate',
    value: function invalidate() {
      this._cache.invalidate(this.path);
    }
  }, {
    key: '_parseDocBlock',
    value: function _parseDocBlock(docBlock) {
      // Extract an id for the module if it's using @providesModule syntax
      // and if it's NOT in node_modules (and not a whitelisted node_module).
      // This handles the case where a project may have a dep that has @providesModule
      // docblock comments, but doesn't want it to conflict with whitelisted @providesModule
      // modules, such as react-haste, fbjs-haste, or react-native or with non-dependency,
      // project-specific code that is using @providesModule.
      var moduleDocBlock = docblock.parseAsObject(docBlock);
      var provides = moduleDocBlock.providesModule || moduleDocBlock.provides;

      var id = provides && !this._depGraphHelpers.isNodeModulesDir(this.path) ? /^\S+/.exec(provides)[0] : undefined;
      return { id: id, moduleDocBlock: moduleDocBlock };
    }
  }, {
    key: '_readDocBlock',
    value: function _readDocBlock(contentPromise) {
      var _this3 = this;

      if (!this._docBlock) {
        if (!contentPromise) {
          contentPromise = this._fastfs.readWhile(this.path, whileInDocBlock);
        }
        this._docBlock = contentPromise.then(function (docBlock) {
          return _this3._parseDocBlock(docBlock);
        });
      }
      return this._docBlock;
    }
  }, {
    key: 'read',
    value: function read(transformOptions) {
      var _this4 = this;

      return this._cache.get(this.path, cacheKey('moduleData', transformOptions), function () {
        var fileContentPromise = _this4._fastfs.readFile(_this4.path);
        return Promise.all([fileContentPromise, _this4._readDocBlock(fileContentPromise)]).then(function (_ref6) {
          var _ref7 = _slicedToArray(_ref6, 2);

          var source = _ref7[0];
          var _ref7$ = _ref7[1];
          var id = _ref7$.id;
          var moduleDocBlock = _ref7$.moduleDocBlock;

          // Ignore requires in JSON files or generated code. An example of this
          // is prebuilt files like the SourceMap library.
          var extern = _this4.isJSON() || 'extern' in moduleDocBlock;
          if (extern) {
            transformOptions = _extends({}, transformOptions, { extern: extern });
          }
          var transformCode = _this4._transformCode;
          var codePromise = transformCode ? transformCode(_this4, source, transformOptions) : Promise.resolve({ code: source });
          return codePromise.then(function (result) {
            var code = result.code;
            var _result$dependencies = result.dependencies;
            var dependencies = _result$dependencies === undefined ? extern ? [] : _this4._extractor(code).deps.sync : _result$dependencies;

            return _extends({}, result, { dependencies: dependencies, id: id, source: source });
          });
        });
      });
    }
  }, {
    key: 'hash',
    value: function hash() {
      return 'Module : ' + this.path;
    }
  }, {
    key: 'isJSON',
    value: function isJSON() {
      return path.extname(this.path) === '.json';
    }
  }, {
    key: 'isAsset',
    value: function isAsset() {
      return false;
    }
  }, {
    key: 'isPolyfill',
    value: function isPolyfill() {
      return false;
    }
  }, {
    key: 'isAsset_DEPRECATED',
    value: function isAsset_DEPRECATED() {
      return false;
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        hash: this.hash(),
        isJSON: this.isJSON(),
        isAsset: this.isAsset(),
        isAsset_DEPRECATED: this.isAsset_DEPRECATED(),
        type: this.type,
        path: this.path
      };
    }
  }]);

  return Module;
}();

function whileInDocBlock(chunk, i, result) {
  // consume leading whitespace
  if (!/\S/.test(result)) {
    return true;
  }

  // check for start of doc block
  if (!/^\s*\/(\*{2}|\*?$)/.test(result)) {
    return false;
  }

  // check for end of doc block
  return !/\*\//.test(result);
}

// use weak map to speed up hash creation of known objects
var knownHashes = new WeakMap();
function stableObjectHash(object) {
  var digest = knownHashes.get(object);
  if (!digest) {
    digest = crypto.createHash('md5').update(jsonStableStringify(object)).digest('base64');
    knownHashes.set(object, digest);
  }

  return digest;
}

function cacheKey(field, transformOptions) {
  return transformOptions !== undefined ? stableObjectHash(transformOptions) + '\0' + field : field;
}

module.exports = Module;