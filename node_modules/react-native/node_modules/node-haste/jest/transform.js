/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const babel = require('babel-core');
const createCacheKeyFunction = require('fbjs-scripts/jest/createCacheKeyFunction');

module.exports = {
  process(src, filename) {
    return babel.transform(src, {
      filename,
      presets: ['es2015', 'stage-2'],
      plugins: [require('fbjs-scripts/babel-6/inline-requires')],
      retainLines: true,
    }).code;
  },

  // Generate a cache key that is based on the module and transform data.
  getCacheKey: createCacheKeyFunction([__filename]),
};
