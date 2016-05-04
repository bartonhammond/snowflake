'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isAbsolutePath = require('absolute-path');
var path = require('./fastpath');

var Package = function () {
  function Package(_ref) {
    var file = _ref.file;
    var fastfs = _ref.fastfs;
    var cache = _ref.cache;

    _classCallCheck(this, Package);

    this.path = file;
    this.root = path.dirname(this.path);
    this._fastfs = fastfs;
    this.type = 'Package';
    this._cache = cache;
  }

  _createClass(Package, [{
    key: 'getMain',
    value: function getMain() {
      var _this = this;

      return this.read().then(function (json) {
        var replacements = getReplacements(json);
        if (typeof replacements === 'string') {
          return path.join(_this.root, replacements);
        }

        var main = json.main || 'index';

        if (replacements && (typeof replacements === 'undefined' ? 'undefined' : _typeof(replacements)) === 'object') {
          main = replacements[main] || replacements[main + '.js'] || replacements[main + '.json'] || replacements[main.replace(/(\.js|\.json)$/, '')] || main;
        }

        return path.join(_this.root, main);
      });
    }
  }, {
    key: 'isHaste',
    value: function isHaste() {
      var _this2 = this;

      return this._cache.get(this.path, 'package-haste', function () {
        return _this2.read().then(function (json) {
          return !!json.name;
        });
      });
    }
  }, {
    key: 'getName',
    value: function getName() {
      var _this3 = this;

      return this._cache.get(this.path, 'package-name', function () {
        return _this3.read().then(function (json) {
          return json.name;
        });
      });
    }
  }, {
    key: 'invalidate',
    value: function invalidate() {
      this._cache.invalidate(this.path);
    }
  }, {
    key: 'redirectRequire',
    value: function redirectRequire(name) {
      var _this4 = this;

      return this.read().then(function (json) {
        var replacements = getReplacements(json);

        if (!replacements || (typeof replacements === 'undefined' ? 'undefined' : _typeof(replacements)) !== 'object') {
          return name;
        }

        if (name[0] !== '/') {
          return replacements[name] || name;
        }

        if (!isAbsolutePath(name)) {
          throw new Error('Expected ' + name + ' to be absolute path');
        }

        var relPath = './' + path.relative(_this4.root, name);
        var redirect = replacements[relPath] || replacements[relPath + '.js'] || replacements[relPath + '.json'];
        if (redirect) {
          return path.join(_this4.root, redirect);
        }

        return name;
      });
    }
  }, {
    key: 'read',
    value: function read() {
      if (!this._reading) {
        this._reading = this._fastfs.readFile(this.path).then(function (jsonStr) {
          return JSON.parse(jsonStr);
        });
      }

      return this._reading;
    }
  }]);

  return Package;
}();

function getReplacements(pkg) {
  var rn = pkg['react-native'];
  var browser = pkg.browser;
  if (rn == null) {
    return browser;
  }

  if (browser == null) {
    return rn;
  }

  if (typeof rn === 'string') {
    rn = _defineProperty({}, pkg.main, rn);
  }

  if (typeof browser === 'string') {
    browser = _defineProperty({}, pkg.main, browser);
  }

  // merge with "browser" as default,
  // "react-native" as override
  return _extends({}, browser, rn);
}

module.exports = Package;