/**
 * # AppAuthToken.js
 *
 * Simple mock of lib/AppAuthToken.js
 */
'use strict'
/**
 * ## Async
 *
 * Need to still treat as async
 */
require('regenerator-runtime/runtime')
export class AppAuthToken {
  /**
   * ## AppAuthToken
   *
   * ### getSessionToken
   * @returns {Object} sessionToken
   */
  async getSessionToken () {
    return await {
      sessionToken: {
        sessionToken: 'token'
      }
    }
  }
  /**
   * ### storeSessionToken
   * @returns {Object} empty
   */
  async storeSessionToken () {
    return await {}
  }
  /**
   * ### deleteSessionToken
   */
  async deleteSessionToken () {
    return await {}
  }
}
export let appAuthToken = new AppAuthToken()
