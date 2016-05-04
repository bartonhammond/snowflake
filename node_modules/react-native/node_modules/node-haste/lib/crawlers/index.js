'use strict';

var nodeCrawl = require('./node');
var watchmanCrawl = require('./watchman');

function crawl(roots, options) {
  var fileWatcher = options.fileWatcher;

  return (fileWatcher ? fileWatcher.isWatchman() : Promise.resolve(false)).then(function (isWatchman) {
    return isWatchman ? watchmanCrawl(roots, options) : nodeCrawl(roots, options);
  });
}

module.exports = crawl;