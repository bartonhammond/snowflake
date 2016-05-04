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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;
var denodeify = require('denodeify');
var sane = require('sane');
var execSync = require('child_process').execSync;

var MAX_WAIT_TIME = 120000;

var detectWatcherClass = function detectWatcherClass() {
  try {
    execSync('watchman version', { stdio: 'ignore' });
    return sane.WatchmanWatcher;
  } catch (e) {}
  return sane.NodeWatcher;
};

var WatcherClass = detectWatcherClass();

var inited = false;

var FileWatcher = function (_EventEmitter) {
  _inherits(FileWatcher, _EventEmitter);

  function FileWatcher(rootConfigs) {
    _classCallCheck(this, FileWatcher);

    if (inited) {
      throw new Error('FileWatcher can only be instantiated once');
    }
    inited = true;

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FileWatcher).call(this));

    _this._watcherByRoot = Object.create(null);

    var watcherPromises = rootConfigs.map(function (rootConfig) {
      return _this._createWatcher(rootConfig);
    });

    _this._loading = Promise.all(watcherPromises).then(function (watchers) {
      watchers.forEach(function (watcher, i) {
        _this._watcherByRoot[rootConfigs[i].dir] = watcher;
        watcher.on('all',
        // args = (type, filePath, root, stat)
        function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _this.emit.apply(_this, ['all'].concat(args));
        });
      });
      return watchers;
    });
    return _this;
  }

  _createClass(FileWatcher, [{
    key: 'getWatchers',
    value: function getWatchers() {
      return this._loading;
    }
  }, {
    key: 'getWatcherForRoot',
    value: function getWatcherForRoot(root) {
      var _this2 = this;

      return this._loading.then(function () {
        return _this2._watcherByRoot[root];
      });
    }
  }, {
    key: 'isWatchman',
    value: function isWatchman() {
      return Promise.resolve(FileWatcher.canUseWatchman());
    }
  }, {
    key: 'end',
    value: function end() {
      inited = false;
      return this._loading.then(function (watchers) {
        return watchers.map(function (watcher) {
          return denodeify(watcher.close).call(watcher);
        });
      });
    }
  }, {
    key: '_createWatcher',
    value: function _createWatcher(rootConfig) {
      var watcher = new WatcherClass(rootConfig.dir, {
        glob: rootConfig.globs,
        dot: false
      });

      return new Promise(function (resolve, reject) {
        var rejectTimeout = setTimeout(function () {
          return reject(new Error(timeoutMessage(WatcherClass)));
        }, MAX_WAIT_TIME);

        watcher.once('ready', function () {
          clearTimeout(rejectTimeout);
          resolve(watcher);
        });
      });
    }
  }], [{
    key: 'createDummyWatcher',
    value: function createDummyWatcher() {
      return Object.assign(new EventEmitter(), {
        isWatchman: function isWatchman() {
          return Promise.resolve(false);
        },
        end: function end() {
          return Promise.resolve();
        }
      });
    }
  }, {
    key: 'canUseWatchman',
    value: function canUseWatchman() {
      return WatcherClass == sane.WatchmanWatcher;
    }
  }]);

  return FileWatcher;
}(EventEmitter);

function timeoutMessage(Watcher) {
  var lines = ['Watcher took too long to load (' + Watcher.name + ')'];
  if (Watcher === sane.WatchmanWatcher) {
    lines.push('Try running `watchman version` from your terminal', 'https://facebook.github.io/watchman/docs/troubleshooting.html');
  }
  return lines.join('\n');
}

module.exports = FileWatcher;