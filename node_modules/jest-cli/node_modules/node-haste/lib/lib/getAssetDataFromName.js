/**
* Copyright (c) 2015-present, Facebook, Inc.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree. An additional grant
* of patent rights can be found in the PATENTS file in the same directory.
*/
'use strict';

var path = require('../fastpath');
var getPlatformExtension = require('./getPlatformExtension');

function getAssetDataFromName(filename) {
  var ext = path.extname(filename);
  var platformExt = getPlatformExtension(filename);

  var pattern = '@([\\d\\.]+)x';
  if (platformExt != null) {
    pattern += '(\\.' + platformExt + ')?';
  }
  pattern += '\\' + ext + '$';
  var re = new RegExp(pattern);

  var match = filename.match(re);
  var resolution = void 0;

  if (!(match && match[1])) {
    resolution = 1;
  } else {
    resolution = parseFloat(match[1], 10);
    if (isNaN(resolution)) {
      resolution = 1;
    }
  }

  var assetName = void 0;
  if (match) {
    assetName = filename.replace(re, ext);
  } else if (platformExt != null) {
    assetName = filename.replace(new RegExp('\\.' + platformExt + '\\' + ext), ext);
  } else {
    assetName = filename;
  }

  return {
    resolution: resolution,
    assetName: assetName,
    type: ext.slice(1),
    name: path.basename(assetName, ext),
    platform: platformExt
  };
}

module.exports = getAssetDataFromName;