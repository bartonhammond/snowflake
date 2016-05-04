'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AssetModule = require('./AssetModule');
var Package = require('./Package');
var Module = require('./Module');
var Polyfill = require('./Polyfill');
var path = require('./fastpath');

var ModuleCache = function () {
  function ModuleCache(_ref) {
    var fastfs = _ref.fastfs;
    var cache = _ref.cache;
    var extractRequires = _ref.extractRequires;
    var transformCode = _ref.transformCode;
    var depGraphHelpers = _ref.depGraphHelpers;
    var assetDependencies = _ref.assetDependencies;
    var moduleOptions = _ref.moduleOptions;

    _classCallCheck(this, ModuleCache);

    this._moduleCache = Object.create(null);
    this._packageCache = Object.create(null);
    this._fastfs = fastfs;
    this._cache = cache;
    this._extractRequires = extractRequires;
    this._transformCode = transformCode;
    this._depGraphHelpers = depGraphHelpers;
    this._assetDependencies = assetDependencies;
    this._moduleOptions = moduleOptions;
    this._packageModuleMap = new WeakMap();

    fastfs.on('change', this._processFileChange.bind(this));
  }

  _createClass(ModuleCache, [{
    key: 'getModule',
    value: function getModule(filePath) {
      if (!this._moduleCache[filePath]) {
        this._moduleCache[filePath] = new Module({
          file: filePath,
          fastfs: this._fastfs,
          moduleCache: this,
          cache: this._cache,
          extractor: this._extractRequires,
          transformCode: this._transformCode,
          depGraphHelpers: this._depGraphHelpers,
          options: this._moduleOptions
        });
      }
      return this._moduleCache[filePath];
    }
  }, {
    key: 'getAllModules',
    value: function getAllModules() {
      return this._moduleCache;
    }
  }, {
    key: 'getAssetModule',
    value: function getAssetModule(filePath) {
      if (!this._moduleCache[filePath]) {
        this._moduleCache[filePath] = new AssetModule({
          file: filePath,
          fastfs: this._fastfs,
          moduleCache: this,
          cache: this._cache,
          dependencies: this._assetDependencies
        });
      }
      return this._moduleCache[filePath];
    }
  }, {
    key: 'getPackage',
    value: function getPackage(filePath) {
      if (!this._packageCache[filePath]) {
        this._packageCache[filePath] = new Package({
          file: filePath,
          fastfs: this._fastfs,
          cache: this._cache
        });
      }
      return this._packageCache[filePath];
    }
  }, {
    key: 'getPackageForModule',
    value: function getPackageForModule(module) {
      if (this._packageModuleMap.has(module)) {
        var _packagePath = this._packageModuleMap.get(module);
        if (this._packageCache[_packagePath]) {
          return this._packageCache[_packagePath];
        } else {
          this._packageModuleMap.delete(module);
        }
      }

      var packagePath = this._fastfs.closest(module.path, 'package.json');
      if (!packagePath) {
        return null;
      }

      this._packageModuleMap.set(module, packagePath);
      return this.getPackage(packagePath);
    }
  }, {
    key: 'createPolyfill',
    value: function createPolyfill(_ref2) {
      var file = _ref2.file;

      return new Polyfill({
        file: file,
        cache: this._cache,
        depGraphHelpers: this._depGraphHelpers,
        fastfs: this._fastfs,
        moduleCache: this,
        transformCode: this._transformCode
      });
    }
  }, {
    key: '_processFileChange',
    value: function _processFileChange(type, filePath, root) {
      var absPath = path.join(root, filePath);

      if (this._moduleCache[absPath]) {
        this._moduleCache[absPath].invalidate();
        delete this._moduleCache[absPath];
      }
      if (this._packageCache[absPath]) {
        this._packageCache[absPath].invalidate();
        delete this._packageCache[absPath];
      }
    }
  }]);

  return ModuleCache;
}();

module.exports = ModuleCache;