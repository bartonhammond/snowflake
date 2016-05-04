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

function resolveModuleRequires(resolutionResponse, module) {
  var pairs = resolutionResponse.getResolvedDependencyPairs(module);
  return pairs ? pairs.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var dependencyModule = _ref2[1];
    return dependencyModule;
  }) : [];
}

function getModuleDependents(cache, module) {
  var dependents = cache.get(module);
  if (!dependents) {
    dependents = new Set();
    cache.set(module, dependents);
  }
  return dependents;
}

/**
 * Returns an object that indicates in which module each module is required.
 */
function getInverseDependencies(resolutionResponse) {
  var cache = new Map();

  resolutionResponse.dependencies.forEach(function (module) {
    resolveModuleRequires(resolutionResponse, module).forEach(function (dependency) {
      getModuleDependents(cache, dependency).add(module);
    });
  });

  return cache;
}

module.exports = getInverseDependencies;