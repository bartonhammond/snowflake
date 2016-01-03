/**
 * # Parse.js
 * 
 * This class mocks lib/Parse.js
 * 
 */
'use strict';
/**
 * ## Async
 * 
 * Need to still treat as async
 */ 
require('regenerator/runtime');

export default class Backend  {
  /**
   * ## Parse
   *
   * ### constructor
   * prepare the response for all the methods
   */
  constructor(){
    var _bodyInit = JSON.stringify({
      code: 200
    });
    this.response = {
      "status": 201
    };
    this.response._bodyInit = _bodyInit;  
  }
  /**
   * ### logout
   * @returns {Object} response
   */
  async logout () {
    return await this.response;
  }
  /**
   * ### login
   * @returns {Object} response
   */
  async login() {
    return await this.response;
  }
  /**
   * ### signup
   * @returns {Object} response
   */
  async signup() {    
    return await this.response;
  }
  /**
   * ### resetPassword
   * @returns {Object} response
   */
  async resetPassword() {
    return await this.response;
  }
  /**
   * ### getProfile
   * @returns {Object} response
   */
  async getProfile() {
    return await this.response;
  }
  /**
   * ### updateProfile
   * @returns {Object} response
   */
  async updateProfile() {
    return await this.response;
  }

}

