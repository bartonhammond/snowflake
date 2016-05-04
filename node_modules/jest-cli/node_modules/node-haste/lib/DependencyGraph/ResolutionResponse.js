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

var ResolutionResponse = function () {
  function ResolutionResponse(_ref) {
    var transformOptions = _ref.transformOptions;

    _classCallCheck(this, ResolutionResponse);

    this.transformOptions = transformOptions;
    this.dependencies = [];
    this.mainModuleId = null;
    this.mocks = null;
    this.numPrependedDependencies = 0;
    this._mappings = Object.create(null);
    this._finalized = false;
  }

  _createClass(ResolutionResponse, [{
    key: 'copy',
    value: function copy(properties) {
      var _properties$dependenc = properties.dependencies;
      var dependencies = _properties$dependenc === undefined ? this.dependencies : _properties$dependenc;
      var _properties$mainModul = properties.mainModuleId;
      var mainModuleId = _properties$mainModul === undefined ? this.mainModuleId : _properties$mainModul;
      var _properties$mocks = properties.mocks;
      var mocks = _properties$mocks === undefined ? this.mocks : _properties$mocks;


      var numPrependedDependencies = dependencies === this.dependencies ? this.numPrependedDependencies : 0;

      return Object.assign(new this.constructor({ transformOptions: this.transformOptions }), this, {
        dependencies: dependencies,
        mainModuleId: mainModuleId,
        mocks: mocks,
        numPrependedDependencies: numPrependedDependencies
      });
    }
  }, {
    key: '_assertNotFinalized',
    value: function _assertNotFinalized() {
      if (this._finalized) {
        throw new Error('Attempted to mutate finalized response.');
      }
    }
  }, {
    key: '_assertFinalized',
    value: function _assertFinalized() {
      if (!this._finalized) {
        throw new Error('Attempted to access unfinalized response.');
      }
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      var _this = this;

      return this._mainModule.getName().then(function (id) {
        _this.mainModuleId = id;
        _this._finalized = true;
        return _this;
      });
    }
  }, {
    key: 'pushDependency',
    value: function pushDependency(module) {
      this._assertNotFinalized();
      if (this.dependencies.length === 0) {
        this._mainModule = module;
      }

      this.dependencies.push(module);
    }
  }, {
    key: 'prependDependency',
    value: function prependDependency(module) {
      this._assertNotFinalized();
      this.dependencies.unshift(module);
      this.numPrependedDependencies += 1;
    }
  }, {
    key: 'setResolvedDependencyPairs',
    value: function setResolvedDependencyPairs(module, pairs) {
      this._assertNotFinalized();
      var hash = module.hash();
      if (this._mappings[hash] == null) {
        this._mappings[hash] = pairs;
      }
    }
  }, {
    key: 'setMocks',
    value: function setMocks(mocks) {
      this.mocks = mocks;
    }
  }, {
    key: 'getResolvedDependencyPairs',
    value: function getResolvedDependencyPairs(module) {
      this._assertFinalized();
      return this._mappings[module.hash()];
    }
  }]);

  return ResolutionResponse;
}();

module.exports = ResolutionResponse;