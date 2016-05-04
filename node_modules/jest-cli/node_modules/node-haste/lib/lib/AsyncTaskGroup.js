/**
* Copyright (c) 2016-present, Facebook, Inc.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree. An additional grant
* of patent rights can be found in the PATENTS file in the same directory.
*/
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
  function AsyncTaskGroup() {
    var _this = this;

    _classCallCheck(this, AsyncTaskGroup);

    this._runningTasks = new Set();
    this._resolve = null;
    this.done = new Promise(function (resolve) {
      return _this._resolve = resolve;
    });
  }

  _createClass(AsyncTaskGroup, [{
    key: 'start',
    value: function start(taskHandle) {
      this._runningTasks.add(taskHandle);
    }
  }, {
    key: 'end',
    value: function end(taskHandle) {
      var runningTasks = this._runningTasks;
      if (runningTasks.delete(taskHandle) && runningTasks.size === 0) {
        this._resolve();
      }
    }
  }]);

  return AsyncTaskGroup;
}();