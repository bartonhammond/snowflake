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

var AssetModule_DEPRECATED = require('../AssetModule_DEPRECATED');
var Fastfs = require('../fastfs');
var debug = require('debug')('ReactNativePackager:DependencyGraph');
var path = require('../fastpath');

var DeprecatedAssetMap = function () {
  function DeprecatedAssetMap(_ref) {
    var fsCrawl = _ref.fsCrawl;
    var roots = _ref.roots;
    var assetExts = _ref.assetExts;
    var fileWatcher = _ref.fileWatcher;
    var ignoreFilePath = _ref.ignoreFilePath;
    var helpers = _ref.helpers;
    var activity = _ref.activity;
    var enabled = _ref.enabled;

    _classCallCheck(this, DeprecatedAssetMap);

    if (roots == null || roots.length === 0 || !enabled) {
      this._disabled = true;
      return;
    }

    this._helpers = helpers;
    this._map = Object.create(null);
    this._assetExts = assetExts;
    this._activity = activity;

    if (!this._disabled) {
      this._fastfs = new Fastfs('Assets', roots, fileWatcher, { ignore: ignoreFilePath, crawling: fsCrawl, activity: activity });

      this._fastfs.on('change', this._processFileChange.bind(this));
    }
  }

  _createClass(DeprecatedAssetMap, [{
    key: 'build',
    value: function build() {
      var _this = this;

      if (this._disabled) {
        return Promise.resolve();
      }

      return this._fastfs.build().then(function () {
        var activity = _this._activity;
        var processAsset_DEPRECATEDActivity = void 0;
        if (activity) {
          processAsset_DEPRECATEDActivity = activity.startEvent('Building (deprecated) Asset Map');
        }

        _this._fastfs.findFilesByExts(_this._assetExts).forEach(function (file) {
          return _this._processAsset(file);
        });

        if (activity) {
          activity.endEvent(processAsset_DEPRECATEDActivity);
        }
      });
    }
  }, {
    key: 'resolve',
    value: function resolve(fromModule, toModuleName) {
      if (this._disabled) {
        return null;
      }

      var assetMatch = toModuleName.match(/^image!(.+)/);
      if (assetMatch && assetMatch[1]) {
        if (!this._map[assetMatch[1]]) {
          debug('WARINING: Cannot find asset:', assetMatch[1]);
          return null;
        }
        return this._map[assetMatch[1]];
      }
    }
  }, {
    key: '_processAsset',
    value: function _processAsset(file) {
      var ext = this._helpers.extname(file);
      if (this._assetExts.indexOf(ext) !== -1) {
        var name = assetName(file, ext);
        if (this._map[name] != null) {
          debug('Conflicting assets', name);
        }

        this._map[name] = new AssetModule_DEPRECATED({ file: file });
      }
    }
  }, {
    key: '_processFileChange',
    value: function _processFileChange(type, filePath, root, fstat) {
      var name = assetName(filePath);
      if (type === 'change' || type === 'delete') {
        delete this._map[name];
      }

      if (type === 'change' || type === 'add') {
        this._processAsset(path.join(root, filePath));
      }
    }
  }]);

  return DeprecatedAssetMap;
}();

function assetName(file, ext) {
  return path.basename(file, '.' + ext).replace(/@[\d\.]+x/, '');
}

module.exports = DeprecatedAssetMap;