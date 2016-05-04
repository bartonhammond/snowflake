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

var Cache = require('./Cache');
var Fastfs = require('./fastfs');
var FileWatcher = require('./FileWatcher');
var Module = require('./Module');
var ModuleCache = require('./ModuleCache');
var Polyfill = require('./Polyfill');
var crawl = require('./crawlers');
var extractRequires = require('./lib/extractRequires');
var getAssetDataFromName = require('./lib/getAssetDataFromName');
var getInverseDependencies = require('./lib/getInverseDependencies');
var getPlatformExtension = require('./lib/getPlatformExtension');
var isAbsolutePath = require('absolute-path');
var replacePatterns = require('./lib/replacePatterns');
var path = require('./fastpath');
var util = require('util');
var DependencyGraphHelpers = require('./DependencyGraph/DependencyGraphHelpers');
var ResolutionRequest = require('./DependencyGraph/ResolutionRequest');
var ResolutionResponse = require('./DependencyGraph/ResolutionResponse');
var HasteMap = require('./DependencyGraph/HasteMap');
var DeprecatedAssetMap = require('./DependencyGraph/DeprecatedAssetMap');

var ERROR_BUILDING_DEP_GRAPH = 'DependencyGraphError';

var defaultActivity = {
  startEvent: function startEvent() {},
  endEvent: function endEvent() {}
};

var DependencyGraph = function () {
  function DependencyGraph(_ref) {
    var activity = _ref.activity;
    var roots = _ref.roots;
    var ignoreFilePath = _ref.ignoreFilePath;
    var fileWatcher = _ref.fileWatcher;
    var assetRoots_DEPRECATED = _ref.assetRoots_DEPRECATED;
    var assetExts = _ref.assetExts;
    var providesModuleNodeModules = _ref.providesModuleNodeModules;
    var platforms = _ref.platforms;
    var preferNativePlatform = _ref.preferNativePlatform;
    var cache = _ref.cache;
    var extensions = _ref.extensions;
    var mocksPattern = _ref.mocksPattern;
    var extractRequires = _ref.extractRequires;
    var transformCode = _ref.transformCode;
    var _ref$shouldThrowOnUnr = _ref.shouldThrowOnUnresolvedErrors;
    var shouldThrowOnUnresolvedErrors = _ref$shouldThrowOnUnr === undefined ? function () {
      return true;
    } : _ref$shouldThrowOnUnr;
    var enableAssetMap = _ref.enableAssetMap;
    var assetDependencies = _ref.assetDependencies;

    _classCallCheck(this, DependencyGraph);

    this._opts = {
      activity: activity || defaultActivity,
      roots: roots,
      ignoreFilePath: ignoreFilePath || function () {},
      fileWatcher: fileWatcher,
      assetRoots_DEPRECATED: assetRoots_DEPRECATED || [],
      assetExts: assetExts || [],
      providesModuleNodeModules: providesModuleNodeModules,
      platforms: platforms || [],
      preferNativePlatform: preferNativePlatform || false,
      extensions: extensions || ['js', 'json'],
      mocksPattern: mocksPattern,
      extractRequires: extractRequires,
      transformCode: transformCode,
      shouldThrowOnUnresolvedErrors: shouldThrowOnUnresolvedErrors,
      enableAssetMap: enableAssetMap || true
    };
    this._cache = cache;
    this._assetDependencies = assetDependencies;
    this._helpers = new DependencyGraphHelpers(this._opts);
    this.load();
  }

  _createClass(DependencyGraph, [{
    key: 'load',
    value: function load() {
      var _this = this;

      if (this._loading) {
        return this._loading;
      }

      var activity = this._opts.activity;

      var depGraphActivity = activity.startEvent('Building Dependency Graph');
      var crawlActivity = activity.startEvent('Crawling File System');
      var allRoots = this._opts.roots.concat(this._opts.assetRoots_DEPRECATED);
      this._crawling = crawl(allRoots, {
        ignore: this._opts.ignoreFilePath,
        exts: this._opts.extensions.concat(this._opts.assetExts),
        fileWatcher: this._opts.fileWatcher
      });
      this._crawling.then(function (files) {
        return activity.endEvent(crawlActivity);
      });

      this._fastfs = new Fastfs('JavaScript', this._opts.roots, this._opts.fileWatcher, {
        ignore: this._opts.ignoreFilePath,
        crawling: this._crawling,
        activity: activity
      });

      this._fastfs.on('change', this._processFileChange.bind(this));

      this._moduleCache = new ModuleCache({
        fastfs: this._fastfs,
        cache: this._cache,
        extractRequires: this._opts.extractRequires,
        transformCode: this._opts.transformCode,
        depGraphHelpers: this._helpers,
        assetDependencies: this._assetDependencies
      });

      this._hasteMap = new HasteMap({
        fastfs: this._fastfs,
        extensions: this._opts.extensions,
        moduleCache: this._moduleCache,
        preferNativePlatform: this._opts.preferNativePlatform,
        helpers: this._helpers
      });

      this._deprecatedAssetMap = new DeprecatedAssetMap({
        fsCrawl: this._crawling,
        roots: this._opts.assetRoots_DEPRECATED,
        helpers: this._helpers,
        fileWatcher: this._opts.fileWatcher,
        ignoreFilePath: this._opts.ignoreFilePath,
        assetExts: this._opts.assetExts,
        activity: this._opts.activity,
        enabled: this._opts.enableAssetMap
      });

      this._loading = Promise.all([this._fastfs.build().then(function () {
        var hasteActivity = activity.startEvent('Building Haste Map');
        return _this._hasteMap.build().then(function (map) {
          activity.endEvent(hasteActivity);
          return map;
        });
      }), this._deprecatedAssetMap.build()]).then(function (response) {
        activity.endEvent(depGraphActivity);
        return response[0]; // Return the haste map
      }, function (err) {
        var error = new Error('Failed to build DependencyGraph: ' + err.message);
        error.type = ERROR_BUILDING_DEP_GRAPH;
        error.stack = err.stack;
        throw error;
      });

      return this._loading;
    }

    /**
     * Returns a promise with the direct dependencies the module associated to
     * the given entryPath has.
     */

  }, {
    key: 'getShallowDependencies',
    value: function getShallowDependencies(entryPath, transformOptions) {
      return this._moduleCache.getModule(entryPath).getDependencies(transformOptions);
    }
  }, {
    key: 'getFS',
    value: function getFS() {
      return this._fastfs;
    }

    /**
     * Returns the module object for the given path.
     */

  }, {
    key: 'getModuleForPath',
    value: function getModuleForPath(entryFile) {
      return this._moduleCache.getModule(entryFile);
    }
  }, {
    key: 'getAllModules',
    value: function getAllModules() {
      var _this2 = this;

      return this.load().then(function () {
        return _this2._moduleCache.getAllModules();
      });
    }
  }, {
    key: 'getDependencies',
    value: function getDependencies(_ref2) {
      var _this3 = this;

      var entryPath = _ref2.entryPath;
      var platform = _ref2.platform;
      var transformOptions = _ref2.transformOptions;
      var onProgress = _ref2.onProgress;
      var _ref2$recursive = _ref2.recursive;
      var recursive = _ref2$recursive === undefined ? true : _ref2$recursive;

      return this.load().then(function () {
        platform = _this3._getRequestPlatform(entryPath, platform);
        var absPath = _this3._getAbsolutePath(entryPath);
        var req = new ResolutionRequest({
          platform: platform,
          preferNativePlatform: _this3._opts.preferNativePlatform,
          entryPath: absPath,
          deprecatedAssetMap: _this3._deprecatedAssetMap,
          hasteMap: _this3._hasteMap,
          helpers: _this3._helpers,
          moduleCache: _this3._moduleCache,
          fastfs: _this3._fastfs,
          shouldThrowOnUnresolvedErrors: _this3._opts.shouldThrowOnUnresolvedErrors
        });

        var response = new ResolutionResponse({ transformOptions: transformOptions });

        return req.getOrderedDependencies({
          response: response,
          mocksPattern: _this3._opts.mocksPattern,
          transformOptions: transformOptions,
          onProgress: onProgress,
          recursive: recursive
        }).then(function () {
          return response;
        });
      });
    }
  }, {
    key: 'matchFilesByPattern',
    value: function matchFilesByPattern(pattern) {
      var _this4 = this;

      return this.load().then(function () {
        return _this4._fastfs.matchFilesByPattern(pattern);
      });
    }
  }, {
    key: '_getRequestPlatform',
    value: function _getRequestPlatform(entryPath, platform) {
      if (platform == null) {
        platform = getPlatformExtension(entryPath);
        if (platform == null || this._opts.platforms.indexOf(platform) === -1) {
          platform = null;
        }
      } else if (this._opts.platforms.indexOf(platform) === -1) {
        throw new Error('Unrecognized platform: ' + platform);
      }
      return platform;
    }
  }, {
    key: '_getAbsolutePath',
    value: function _getAbsolutePath(filePath) {
      if (isAbsolutePath(filePath)) {
        return path.resolve(filePath);
      }

      for (var i = 0; i < this._opts.roots.length; i++) {
        var root = this._opts.roots[i];
        var potentialAbsPath = path.join(root, filePath);
        if (this._fastfs.fileExists(potentialAbsPath)) {
          return path.resolve(potentialAbsPath);
        }
      }

      throw new NotFoundError('Cannot find entry file %s in any of the roots: %j', filePath, this._opts.roots);
    }
  }, {
    key: '_processFileChange',
    value: function _processFileChange(type, filePath, root, fstat) {
      var _this5 = this;

      var absPath = path.join(root, filePath);
      if (fstat && fstat.isDirectory() || this._opts.ignoreFilePath(absPath) || this._helpers.isNodeModulesDir(absPath)) {
        return;
      }

      // Ok, this is some tricky promise code. Our requirements are:
      // * we need to report back failures
      // * failures shouldn't block recovery
      // * Errors can leave `hasteMap` in an incorrect state, and we need to rebuild
      // After we process a file change we record any errors which will also be
      // reported via the next request. On the next file change, we'll see that
      // we are in an error state and we should decide to do a full rebuild.
      var resolve = function resolve() {
        if (_this5._hasteMapError) {
          console.warn('Rebuilding haste map to recover from error:\n' + _this5._hasteMapError.stack);
          _this5._hasteMapError = null;

          // Rebuild the entire map if last change resulted in an error.
          _this5._loading = _this5._hasteMap.build();
        } else {
          _this5._loading = _this5._hasteMap.processFileChange(type, absPath);
          _this5._loading.catch(function (e) {
            return _this5._hasteMapError = e;
          });
        }
        return _this5._loading;
      };
      this._loading = this._loading.then(resolve, resolve);
    }
  }, {
    key: 'createPolyfill',
    value: function createPolyfill(options) {
      return this._moduleCache.createPolyfill(options);
    }
  }]);

  return DependencyGraph;
}();

Object.assign(DependencyGraph, {
  Cache: Cache,
  Fastfs: Fastfs,
  FileWatcher: FileWatcher,
  Module: Module,
  Polyfill: Polyfill,
  extractRequires: extractRequires,
  getAssetDataFromName: getAssetDataFromName,
  getPlatformExtension: getPlatformExtension,
  replacePatterns: replacePatterns,
  getInverseDependencies: getInverseDependencies
});

function NotFoundError() {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  var msg = util.format.apply(util, arguments);
  this.message = msg;
  this.type = this.name = 'NotFoundError';
  this.status = 404;
}
util.inherits(NotFoundError, Error);

module.exports = DependencyGraph;