/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

 'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function buildCacheKey(files, base) {
  return files.reduce(
    (src, fileName) => src + fs.readFileSync(fileName),
    base
  );
}

const transformRoot = path.join(__dirname, '..');
const cacheKeyFiles = [
  __filename,
  path.join(transformRoot, 'babel', 'default-options.js'),
  path.join(transformRoot, 'babel', 'dev-expression.js'),
  path.join(transformRoot, 'babel', 'inline-requires.js'),
  path.join(transformRoot, 'babel', 'rewrite-modules.js'),
];

const cacheKeyBase = buildCacheKey(cacheKeyFiles, '');

module.exports = files => {
  const cacheKey = buildCacheKey(files, cacheKeyBase);
  return (src, file, configString) => crypto.createHash('md5')
    .update(cacheKey)
    .update(src + file + configString)
    .digest('hex');
};
