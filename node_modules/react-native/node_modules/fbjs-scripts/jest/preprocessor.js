/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const assign = require('object-assign');
const babel = require('babel');
const babelDefaultOptions = require('../babel/default-options');
const createCacheKeyFunction = require('./createCacheKeyFunction');

module.exports = {
  process(src, filename) {
    return babel.transform(src, assign(
      {},
      babelDefaultOptions,
      {
        filename: filename,
        retainLines: true
      }
    )).code;
  },

  // Generate a cache key that is based on the module and transform data.
  getCacheKey: createCacheKeyFunction([__filename])
};
