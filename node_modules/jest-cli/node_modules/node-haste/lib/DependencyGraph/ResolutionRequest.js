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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AsyncTaskGroup = require('../lib/AsyncTaskGroup');
var MapWithDefaults = require('../lib/MapWithDefaults');
var debug = require('debug')('ReactNativePackager:DependencyGraph');
var util = require('util');
var path = require('../fastpath');
var realPath = require('path');
var isAbsolutePath = require('absolute-path');
var getAssetDataFromName = require('../lib/getAssetDataFromName');
var throat = require('throat')(Promise);

var MAX_CONCURRENT_FILE_READS = 32;
var getDependencies = throat(MAX_CONCURRENT_FILE_READS, function (module, transformOptions) {
  return module.getDependencies(transformOptions);
});

var ResolutionRequest = function () {
  function ResolutionRequest(_ref) {
    var platform = _ref.platform;
    var preferNativePlatform = _ref.preferNativePlatform;
    var entryPath = _ref.entryPath;
    var hasteMap = _ref.hasteMap;
    var deprecatedAssetMap = _ref.deprecatedAssetMap;
    var helpers = _ref.helpers;
    var moduleCache = _ref.moduleCache;
    var fastfs = _ref.fastfs;
    var shouldThrowOnUnresolvedErrors = _ref.shouldThrowOnUnresolvedErrors;
    var extraNodeModules = _ref.extraNodeModules;

    _classCallCheck(this, ResolutionRequest);

    this._platform = platform;
    this._preferNativePlatform = preferNativePlatform;
    this._entryPath = entryPath;
    this._hasteMap = hasteMap;
    this._deprecatedAssetMap = deprecatedAssetMap;
    this._helpers = helpers;
    this._moduleCache = moduleCache;
    this._fastfs = fastfs;
    this._shouldThrowOnUnresolvedErrors = shouldThrowOnUnresolvedErrors;
    this._extraNodeModules = extraNodeModules;
    this._resetResolutionCache();
  }

  _createClass(ResolutionRequest, [{
    key: '_tryResolve',
    value: function _tryResolve(action, secondaryAction) {
      return action().catch(function (error) {
        if (error.type !== 'UnableToResolveError') {
          throw error;
        }
        return secondaryAction();
      });
    }
  }, {
    key: 'resolveDependency',
    value: function resolveDependency(fromModule, toModuleName) {
      var _this = this;

      var resHash = resolutionHash(fromModule.path, toModuleName);

      if (this._immediateResolutionCache[resHash]) {
        return Promise.resolve(this._immediateResolutionCache[resHash]);
      }

      var asset_DEPRECATED = this._deprecatedAssetMap.resolve(fromModule, toModuleName);
      if (asset_DEPRECATED) {
        return Promise.resolve(asset_DEPRECATED);
      }

      var cacheResult = function cacheResult(result) {
        _this._immediateResolutionCache[resHash] = result;
        return result;
      };

      var forgive = function forgive(error) {
        if (error.type !== 'UnableToResolveError' || _this._shouldThrowOnUnresolvedErrors(_this._entryPath, _this._platform)) {
          throw error;
        }

        debug('Unable to resolve module %s from %s', toModuleName, fromModule.path);
        return null;
      };

      if (!this._helpers.isNodeModulesDir(fromModule.path) && !(isRelativeImport(toModuleName) || isAbsolutePath(toModuleName))) {
        return this._tryResolve(function () {
          return _this._resolveHasteDependency(fromModule, toModuleName);
        }, function () {
          return _this._resolveNodeDependency(fromModule, toModuleName);
        }).then(cacheResult, forgive);
      }

      return this._resolveNodeDependency(fromModule, toModuleName).then(cacheResult, forgive);
    }
  }, {
    key: 'getOrderedDependencies',
    value: function getOrderedDependencies(_ref2) {
      var _this2 = this;

      var response = _ref2.response;
      var mocksPattern = _ref2.mocksPattern;
      var transformOptions = _ref2.transformOptions;
      var onProgress = _ref2.onProgress;
      var _ref2$recursive = _ref2.recursive;
      var recursive = _ref2$recursive === undefined ? true : _ref2$recursive;

      return this._getAllMocks(mocksPattern).then(function (allMocks) {
        var entry = _this2._moduleCache.getModule(_this2._entryPath);
        var mocks = Object.create(null);

        response.pushDependency(entry);
        var totalModules = 1;
        var finishedModules = 0;

        var resolveDependencies = function resolveDependencies(module) {
          return getDependencies(module, transformOptions).then(function (dependencyNames) {
            return Promise.all(dependencyNames.map(function (name) {
              return _this2.resolveDependency(module, name);
            })).then(function (dependencies) {
              return [dependencyNames, dependencies];
            });
          });
        };

        var addMockDependencies = !allMocks ? function (module, result) {
          return result;
        } : function (module, _ref3) {
          var _ref4 = _slicedToArray(_ref3, 2);

          var dependencyNames = _ref4[0];
          var dependencies = _ref4[1];

          var list = [module.getName()];
          var pkg = module.getPackage();
          if (pkg) {
            list.push(pkg.getName());
          }
          return Promise.all(list).then(function (names) {
            names.forEach(function (name) {
              if (allMocks[name] && !mocks[name]) {
                var mockModule = _this2._moduleCache.getModule(allMocks[name]);
                dependencyNames.push(name);
                dependencies.push(mockModule);
                mocks[name] = allMocks[name];
              }
            });
            return [dependencyNames, dependencies];
          });
        };

        var collectedDependencies = new MapWithDefaults(function (module) {
          return collect(module);
        });
        var crawlDependencies = function crawlDependencies(mod, _ref5) {
          var _ref6 = _slicedToArray(_ref5, 2);

          var depNames = _ref6[0];
          var dependencies = _ref6[1];

          var filteredPairs = [];

          dependencies.forEach(function (modDep, i) {
            var name = depNames[i];
            if (modDep == null) {
              // It is possible to require mocks that don't have a real
              // module backing them. If a dependency cannot be found but there
              // exists a mock with the desired ID, resolve it and add it as
              // a dependency.
              if (allMocks && allMocks[name] && !mocks[name]) {
                var mockModule = _this2._moduleCache.getModule(allMocks[name]);
                mocks[name] = allMocks[name];
                return filteredPairs.push([name, mockModule]);
              }

              debug('WARNING: Cannot find required module `%s` from module `%s`', name, mod.path);
              return false;
            }
            return filteredPairs.push([name, modDep]);
          });

          response.setResolvedDependencyPairs(mod, filteredPairs);

          var dependencyModules = filteredPairs.map(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2);

            var m = _ref8[1];
            return m;
          });
          var newDependencies = dependencyModules.filter(function (m) {
            return !collectedDependencies.has(m);
          });

          if (onProgress) {
            finishedModules += 1;
            totalModules += newDependencies.length;
            onProgress(finishedModules, totalModules);
          }

          if (recursive) {
            // doesn't block the return of this function invocation, but defers
            // the resulution of collectionsInProgress.done.then(…)
            dependencyModules.forEach(function (dependency) {
              return collectedDependencies.get(dependency);
            });
          }
          return dependencyModules;
        };

        var collectionsInProgress = new AsyncTaskGroup();
        function collect(module) {
          collectionsInProgress.start(module);
          var result = resolveDependencies(module).then(function (result) {
            return addMockDependencies(module, result);
          }).then(function (result) {
            return crawlDependencies(module, result);
          });
          var end = function end() {
            return collectionsInProgress.end(module);
          };
          result.then(end, end);
          return result;
        }

        return Promise.all([
        // kicks off recursive dependency discovery, but doesn't block until it's done
        collectedDependencies.get(entry),

        // resolves when there are no more modules resolving dependencies
        collectionsInProgress.done]).then(function (_ref9) {
          var _ref10 = _slicedToArray(_ref9, 1);

          var rootDependencies = _ref10[0];

          return Promise.all(Array.from(collectedDependencies, resolveKeyWithPromise)).then(function (moduleToDependenciesPairs) {
            return [rootDependencies, new MapWithDefaults(function () {
              return [];
            }, moduleToDependenciesPairs)];
          });
        }).then(function (_ref11) {
          var _ref12 = _slicedToArray(_ref11, 2);

          var rootDependencies = _ref12[0];
          var moduleDependencies = _ref12[1];

          // serialize dependencies, and make sure that every single one is only
          // included once
          var seen = new Set([entry]);
          function traverse(dependencies) {
            dependencies.forEach(function (dependency) {
              if (seen.has(dependency)) {
                return;
              }

              seen.add(dependency);
              response.pushDependency(dependency);
              traverse(moduleDependencies.get(dependency));
            });
          }

          traverse(rootDependencies);
          response.setMocks(mocks);
        });
      });
    }
  }, {
    key: '_getAllMocks',
    value: function _getAllMocks(pattern) {
      // Take all mocks in all the roots into account. This is necessary
      // because currently mocks are global: any module can be mocked by
      // any mock in the system.
      var mocks = null;
      if (pattern) {
        mocks = Object.create(null);
        this._fastfs.matchFilesByPattern(pattern).forEach(function (file) {
          return mocks[path.basename(file, path.extname(file))] = file;
        });
      }
      return Promise.resolve(mocks);
    }
  }, {
    key: '_resolveHasteDependency',
    value: function _resolveHasteDependency(fromModule, toModuleName) {
      var _this3 = this;

      toModuleName = normalizePath(toModuleName);

      var p = fromModule.getPackage();
      if (p) {
        p = p.redirectRequire(toModuleName);
      } else {
        p = Promise.resolve(toModuleName);
      }

      return p.then(function (realModuleName) {
        var dep = _this3._hasteMap.getModule(realModuleName, _this3._platform);
        if (dep && dep.type === 'Module') {
          return dep;
        }

        var packageName = realModuleName;
        while (packageName && packageName !== '.') {
          dep = _this3._hasteMap.getModule(packageName, _this3._platform);
          if (dep && dep.type === 'Package') {
            break;
          }
          packageName = path.dirname(packageName);
        }

        if (dep && dep.type === 'Package') {
          var _ret = function () {
            var potentialModulePath = path.join(dep.root, path.relative(packageName, realModuleName));
            return {
              v: _this3._tryResolve(function () {
                return _this3._loadAsFile(potentialModulePath, fromModule, toModuleName);
              }, function () {
                return _this3._loadAsDir(potentialModulePath, fromModule, toModuleName);
              })
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }

        throw new UnableToResolveError(fromModule, toModuleName, 'Unable to resolve dependency');
      });
    }
  }, {
    key: '_redirectRequire',
    value: function _redirectRequire(fromModule, modulePath) {
      return Promise.resolve(fromModule.getPackage()).then(function (p) {
        if (p) {
          return p.redirectRequire(modulePath);
        }
        return modulePath;
      });
    }
  }, {
    key: '_resolveFileOrDir',
    value: function _resolveFileOrDir(fromModule, toModuleName) {
      var _this4 = this;

      var potentialModulePath = isAbsolutePath(toModuleName) ? toModuleName : path.join(path.dirname(fromModule.path), toModuleName);

      return this._redirectRequire(fromModule, potentialModulePath).then(function (realModuleName) {
        return _this4._tryResolve(function () {
          return _this4._loadAsFile(realModuleName, fromModule, toModuleName);
        }, function () {
          return _this4._loadAsDir(realModuleName, fromModule, toModuleName);
        });
      });
    }
  }, {
    key: '_resolveNodeDependency',
    value: function _resolveNodeDependency(fromModule, toModuleName) {
      var _this5 = this;

      if (isRelativeImport(toModuleName) || isAbsolutePath(toModuleName)) {
        return this._resolveFileOrDir(fromModule, toModuleName);
      } else {
        return this._redirectRequire(fromModule, toModuleName).then(function (realModuleName) {
          if (isRelativeImport(realModuleName) || isAbsolutePath(realModuleName)) {
            // derive absolute path /.../node_modules/fromModuleDir/realModuleName
            var fromModuleParentIdx = fromModule.path.lastIndexOf('node_modules/') + 13;
            var fromModuleDir = fromModule.path.slice(0, fromModule.path.indexOf('/', fromModuleParentIdx));
            var absPath = path.join(fromModuleDir, realModuleName);
            return _this5._resolveFileOrDir(fromModule, absPath);
          }

          var searchQueue = [];
          for (var currDir = path.dirname(fromModule.path); currDir !== realPath.parse(fromModule.path).root; currDir = path.dirname(currDir)) {
            searchQueue.push(path.join(currDir, 'node_modules', realModuleName));
          }

          if (_this5._extraNodeModules) {
            var bits = toModuleName.split('/');
            var packageName = bits[0];
            if (_this5._extraNodeModules[packageName]) {
              bits[0] = _this5._extraNodeModules[packageName];
              searchQueue.push(path.join.apply(path, bits));
            }
          }

          var p = Promise.reject(new UnableToResolveError(fromModule, toModuleName, 'Node module not found'));
          searchQueue.forEach(function (potentialModulePath) {
            p = _this5._tryResolve(function () {
              return _this5._tryResolve(function () {
                return p;
              }, function () {
                return _this5._loadAsFile(potentialModulePath, fromModule, toModuleName);
              });
            }, function () {
              return _this5._loadAsDir(potentialModulePath, fromModule, toModuleName);
            });
          });

          return p;
        });
      }
    }
  }, {
    key: '_loadAsFile',
    value: function _loadAsFile(potentialModulePath, fromModule, toModule) {
      var _this6 = this;

      return Promise.resolve().then(function () {
        if (_this6._helpers.isAssetFile(potentialModulePath)) {
          var dirname = path.dirname(potentialModulePath);
          if (!_this6._fastfs.dirExists(dirname)) {
            throw new UnableToResolveError(fromModule, toModule, 'Directory ' + dirname + ' doesn\'t exist');
          }

          var _getAssetDataFromName = getAssetDataFromName(potentialModulePath);

          var name = _getAssetDataFromName.name;
          var type = _getAssetDataFromName.type;


          var pattern = '^' + name + '(@[\\d\\.]+x)?';
          if (_this6._platform != null) {
            pattern += '(\\.' + _this6._platform + ')?';
          }
          pattern += '\\.' + type;

          // We arbitrarly grab the first one, because scale selection
          // will happen somewhere

          var _fastfs$matches = _this6._fastfs.matches(dirname, new RegExp(pattern));

          var _fastfs$matches2 = _slicedToArray(_fastfs$matches, 1);

          var assetFile = _fastfs$matches2[0];


          if (assetFile) {
            return _this6._moduleCache.getAssetModule(assetFile);
          }
        }

        var file = void 0;
        if (_this6._fastfs.fileExists(potentialModulePath)) {
          file = potentialModulePath;
        } else if (_this6._platform != null && _this6._fastfs.fileExists(potentialModulePath + '.' + _this6._platform + '.js')) {
          file = potentialModulePath + '.' + _this6._platform + '.js';
        } else if (_this6._preferNativePlatform && _this6._fastfs.fileExists(potentialModulePath + '.native.js')) {
          file = potentialModulePath + '.native.js';
        } else if (_this6._fastfs.fileExists(potentialModulePath + '.js')) {
          file = potentialModulePath + '.js';
        } else if (_this6._fastfs.fileExists(potentialModulePath + '.json')) {
          file = potentialModulePath + '.json';
        } else {
          throw new UnableToResolveError(fromModule, toModule, 'File ' + potentialModulePath + ' doesnt exist');
        }

        return _this6._moduleCache.getModule(file);
      });
    }
  }, {
    key: '_loadAsDir',
    value: function _loadAsDir(potentialDirPath, fromModule, toModule) {
      var _this7 = this;

      return Promise.resolve().then(function () {
        if (!_this7._fastfs.dirExists(potentialDirPath)) {
          throw new UnableToResolveError(fromModule, toModule, 'Unable to find this module in its module map or any of the node_modules directories under ' + potentialDirPath + ' and its parent directories\n\nThis might be related to https://github.com/facebook/react-native/issues/4968\nTo resolve try the following:\n  1. Clear watchman watches: `watchman watch-del-all`.\n  2. Delete the `node_modules` folder: `rm -rf node_modules && npm install`.\n  3. Reset packager cache: `rm -fr $TMPDIR/react-*` or `npm start -- --reset-cache`.');
        }

        var packageJsonPath = path.join(potentialDirPath, 'package.json');
        if (_this7._fastfs.fileExists(packageJsonPath)) {
          return _this7._moduleCache.getPackage(packageJsonPath).getMain().then(function (main) {
            return _this7._tryResolve(function () {
              return _this7._loadAsFile(main, fromModule, toModule);
            }, function () {
              return _this7._loadAsDir(main, fromModule, toModule);
            });
          });
        }

        return _this7._loadAsFile(path.join(potentialDirPath, 'index'), fromModule, toModule);
      });
    }
  }, {
    key: '_resetResolutionCache',
    value: function _resetResolutionCache() {
      this._immediateResolutionCache = Object.create(null);
    }
  }]);

  return ResolutionRequest;
}();

function resolutionHash(modulePath, depName) {
  return path.resolve(modulePath) + ':' + depName;
}

function UnableToResolveError(fromModule, toModule, message) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.message = util.format('Unable to resolve module %s from %s: %s', toModule, fromModule.path, message);
  this.type = this.name = 'UnableToResolveError';
}

util.inherits(UnableToResolveError, Error);

function normalizePath(modulePath) {
  if (path.sep === '/') {
    modulePath = path.normalize(modulePath);
  } else if (path.posix) {
    modulePath = path.posix.normalize(modulePath);
  }

  return modulePath.replace(/\/$/, '');
}

function resolveKeyWithPromise(_ref13) {
  var _ref14 = _slicedToArray(_ref13, 2);

  var key = _ref14[0];
  var promise = _ref14[1];

  return promise.then(function (value) {
    return [key, value];
  });
}

function isRelativeImport(path) {
  return (/^[.][.]?[/]/.test(path)
  );
}

module.exports = ResolutionRequest;