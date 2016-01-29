/**
 * # AppAuthToken.js
 * 
 * Simple mock of lib/AppAuthToken.js
 */
'use strict';
/**
 * ## Async
 * 
 * Need to still treat as async
 */ 
require('regenerator/runtime');
export default class AppAuthToken {
  /**
   * ## AppAuthToken
   *
   * ### getSessionToken
   * @returns {Object} sessionToken
   */
  getSessionToken () {
    return Promise.resolve( {
      sessionToken: {
        sessionToken: 'token'
      }
    });
  }
  /**
   * ### storeSessionToken
   * @returns {Object} empty
   */
  storeSessionToken() {
    return Promise.resolve({});
  }
  /**
   * ### deleteSessionToken
   */  
  deleteSessionToken () {
    return Promise.resolve({});
  }
};


