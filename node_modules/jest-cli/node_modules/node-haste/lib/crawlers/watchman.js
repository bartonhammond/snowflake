'use strict';

var denodeify = require('denodeify');
var path = require('../fastpath');

var watchmanURL = 'https://facebook.github.io/watchman/docs/troubleshooting.html';

function watchmanRecReadDir(roots, _ref) {
  var ignore = _ref.ignore;
  var fileWatcher = _ref.fileWatcher;
  var exts = _ref.exts;

  var files = [];
  return Promise.all(roots.map(function (root) {
    return fileWatcher.getWatcherForRoot(root);
  })).then(function (watchers) {
    // All watchman roots for all watches we have.
    var watchmanRoots = watchers.map(function (watcher) {
      return watcher.watchProjectInfo.root;
    });

    // Actual unique watchers (because we use watch-project we may end up with
    // duplicate "real" watches, and that's by design).
    // TODO(amasad): push this functionality into the `FileWatcher`.
    var uniqueWatchers = watchers.filter(function (watcher, i) {
      return watchmanRoots.indexOf(watcher.watchProjectInfo.root) === i;
    });

    return Promise.all(uniqueWatchers.map(function (watcher) {
      var watchedRoot = watcher.watchProjectInfo.root;

      // Build up an expression to filter the output by the relevant roots.
      var dirExpr = ['anyof'];
      for (var i = 0; i < roots.length; i++) {
        var root = roots[i];
        if (isDescendant(watchedRoot, root)) {
          dirExpr.push(['dirname', path.relative(watchedRoot, root)]);
        }
      }

      var cmd = denodeify(watcher.client.command.bind(watcher.client));
      return cmd(['query', watchedRoot, {
        suffix: exts,
        expression: ['allof', ['type', 'f'], 'exists', dirExpr],
        fields: ['name']
      }]).then(function (resp) {
        if ('warning' in resp) {
          console.warn('watchman warning: ', resp.warning);
        }

        resp.files.forEach(function (filePath) {
          filePath = watchedRoot + path.sep + filePath;
          if (!ignore(filePath)) {
            files.push(filePath);
          }
          return false;
        });
      });
    }));
  }).then(function () {
    return files;
  }, function (error) {
    throw new Error('Watchman error: ' + error.message.trim() + '. Make sure watchman ' + ('is running for this project. See ' + watchmanURL + '.'));
  });
}

function isDescendant(root, child) {
  return child.startsWith(root);
}

module.exports = watchmanRecReadDir;