/**
 * # deviceActions.js
 * 
 * What platform are we running on, ie ```ios``` or ```android```
 *
 * What version is the app?
 * 
 */
'use strict';

/**
 * ## Imports
 * 
 * The actions supported
 */
const {
  SET_PLATFORM,
  SET_VERSION
} = require ('../../lib/constants').default;

/**
 * ## Set the platformState 
 *
 */
export function setPlatform(platform) {
  return {
    type: SET_PLATFORM,
    payload: platform
  };
}
/**
 * ## set the version
 *
 */
export function setVersion(version) {
  return {
    type: SET_VERSION,
    payload: version
  };
}
