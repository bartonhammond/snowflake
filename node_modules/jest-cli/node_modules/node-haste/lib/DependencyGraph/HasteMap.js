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

var path = require('../fastpath');
var getPlatformExtension = require('../lib/getPlatformExtension');

var GENERIC_PLATFORM = 'generic';
var NATIVE_PLATFORM = 'native';
var PACKAGE_JSON = path.sep + 'package.json';

var HasteMap = function () {
  function HasteMap(_ref) {
    var extensions = _ref.extensions;
    var fastfs = _ref.fastfs;
    var moduleCache = _ref.moduleCache;
    var preferNativePlatform = _ref.preferNativePlatform;
    var helpers = _ref.helpers;

    _classCallCheck(this, HasteMap);

    this._extensions = extensions;
    this._fastfs = fastfs;
    this._moduleCache = moduleCache;
    this._preferNativePlatform = preferNativePlatform;
    this._helpers = helpers;
  }

  _createClass(HasteMap, [{
    key: 'build',
    value: function build() {
      var _this = this;

      this._map = Object.create(null);
      var promises = [];
      this._fastfs.getAllFiles().forEach(function (filePath) {
        if (!_this._helpers.isNodeModulesDir(filePath)) {
          if (_this._extensions.indexOf(path.extname(filePath).substr(1)) !== -1) {
            promises.push(_this._processHasteModule(filePath));
          }
          if (filePath.endsWith(PACKAGE_JSON)) {
            promises.push(_this._processHastePackage(filePath));
          }
        }
      });
      return Promise.all(promises).then(function () {
        return _this._map;
      });
    }
  }, {
    key: 'processFileChange',
    value: function processFileChange(type, absPath) {
      var _this2 = this;

      return Promise.resolve().then(function () {
        /*eslint no-labels: 0 */
        if (type === 'delete' || type === 'change') {
          loop: for (var name in _this2._map) {
            var modulesMap = _this2._map[name];
            for (var platform in modulesMap) {
              var _module = modulesMap[platform];
              if (_module.path === absPath) {
                delete modulesMap[platform];
                break loop;
              }
            }
          }

          if (type === 'delete') {
            return null;
          }
        }

        if (_this2._extensions.indexOf(_this2._helpers.extname(absPath)) !== -1) {
          if (path.basename(absPath) === 'package.json') {
            return _this2._processHastePackage(absPath);
          } else {
            return _this2._processHasteModule(absPath);
          }
        }
      });
    }
  }, {
    key: 'getModule',
    value: function getModule(name) {
      var platform = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var modulesMap = this._map[name];
      if (modulesMap == null) {
        return null;
      }

      // If platform is 'ios', we prefer .ios.js to .native.js which we prefer to
      // a plain .js file.
      var module = undefined;
      if (module == null && platform != null) {
        module = modulesMap[platform];
      }
      if (module == null && this._preferNativePlatform) {
        module = modulesMap[NATIVE_PLATFORM];
      }
      if (module == null) {
        module = modulesMap[GENERIC_PLATFORM];
      }
      return module;
    }
  }, {
    key: '_processHasteModule',
    value: function _processHasteModule(file) {
      var _this3 = this;

      var module = this._moduleCache.getModule(file);
      return module.isHaste().then(function (isHaste) {
        return isHaste && module.getName().then(function (name) {
          return _this3._updateHasteMap(name, module);
        });
      });
    }
  }, {
    key: '_processHastePackage',
    value: function _processHastePackage(file) {
      var _this4 = this;

      file = path.resolve(file);
      var p = this._moduleCache.getPackage(file);
      return p.isHaste().then(function (isHaste) {
        return isHaste && p.getName().then(function (name) {
          return _this4._updateHasteMap(name, p);
        });
      }).catch(function (e) {
        if (e instanceof SyntaxError) {
          // Malformed package.json.
          return;
        }
        throw e;
      });
    }
  }, {
    key: '_updateHasteMap',
    value: function _updateHasteMap(name, mod) {
      if (this._map[name] == null) {
        this._map[name] = Object.create(null);
      }

      var moduleMap = this._map[name];
      var modulePlatform = getPlatformExtension(mod.path) || GENERIC_PLATFORM;
      var existingModule = moduleMap[modulePlatform];

      if (existingModule && existingModule.path !== mod.path) {
        throw new Error('@providesModule naming collision:\n' + ('  Duplicate module name: ' + name + '\n') + ('  Paths: ' + mod.path + ' collides with ' + existingModule.path + '\n\n') + 'This error is caused by a @providesModule declaration ' + 'with the same name accross two different files.');
      }

      moduleMap[modulePlatform] = mod;
    }
  }]);

  return HasteMap;
}();

module.exports = HasteMap;