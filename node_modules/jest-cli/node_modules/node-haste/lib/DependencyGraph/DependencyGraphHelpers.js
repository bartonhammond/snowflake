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

var NODE_MODULES = path.sep + 'node_modules' + path.sep;

var DependencyGraphHelpers = function () {
  function DependencyGraphHelpers(_ref) {
    var providesModuleNodeModules = _ref.providesModuleNodeModules;
    var assetExts = _ref.assetExts;

    _classCallCheck(this, DependencyGraphHelpers);

    this._providesModuleNodeModules = providesModuleNodeModules;
    this._assetExts = assetExts;
  }

  _createClass(DependencyGraphHelpers, [{
    key: 'isNodeModulesDir',
    value: function isNodeModulesDir(file) {
      var index = file.lastIndexOf(NODE_MODULES);
      if (index === -1) {
        return false;
      }

      var parts = file.substr(index + 14).split(path.sep);
      var dirs = this._providesModuleNodeModules;
      for (var i = 0; i < dirs.length; i++) {
        if (parts.indexOf(dirs[i]) > -1) {
          return false;
        }
      }

      return true;
    }
  }, {
    key: 'isAssetFile',
    value: function isAssetFile(file) {
      return this._assetExts.indexOf(this.extname(file)) !== -1;
    }
  }, {
    key: 'extname',
    value: function extname(name) {
      return path.extname(name).substr(1);
    }
  }]);

  return DependencyGraphHelpers;
}();

module.exports = DependencyGraphHelpers;