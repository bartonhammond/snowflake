/**
 * # Parse.js
 * 
 * This class interfaces with Parse.com using the rest api
 * see [https://parse.com/docs/rest/guide](https://parse.com/docs/rest/guide)
 *
 */
'use string';
/**
 * ## Async support
 * 
 */ 
require('regenerator/runtime');

/**
 * ## Imports
 * 
 * Config for defaults and underscore for a couple of features
 */ 
import CONFIG from './config';
import _ from 'underscore';

export default class Parse {
  /**
   * ## Parse
   *
   * constructor sets the default keys required by Parse.com
   * if a user is logged in, we'll need the sessionToken
   *
   */
  constructor( sessionToken) { 
    this._applicationId = CONFIG.PARSE.APP_ID;
    this._restAPIKey = CONFIG.PARSE.REST_API_KEY;
    this._masterKey = null;
    this._sessionToken =
      _.isUndefined(sessionToken) ?  null :  sessionToken;
    this.API_BASE_URL= 'https://api.parse.com';
  }
  /**
   * ### storeSessionToken
   * Store the session key 
   */
  async signup(data) {
    try {
      return await this._fetch({
        method: 'POST',
        url: '/1/users',
        body: data
      });
    } catch(error) {
      throw error;
    }
  }
  /**
   * ### login
   * encode the data and and call _fetch
   */
  async login(data) {
    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    try {
      return await this._fetch({
        method: 'GET',
        url: '/1/login?' + formBody
      });
    } catch(error) {
      throw error;
    }
  }
  /**
   * ### logout
   * prepare the request and call _fetch
   */  
  async logout() {
    try {
      return await this._fetch({
        method: 'POST',
        url: '/1/logout',
        body: {}
      });
    } catch(error) {
      throw error;
    }
  }
  /**
   * ### resetPassword
   * the data is already in a JSON format, so call _fetch
   */
  async resetPassword(data) {
    try {
      return await this._fetch({
        method: 'POST',
        url: '/1/requestPasswordReset',
        body: data
      });
    } catch(error) {
      throw error;
    }
  }  
  /**
   * ### getProfile
   * Using the sessionToken, we'll get everything about
   * the current user.
   */
  async getProfile() {
   try {
      return await this._fetch({
        method: 'GET',
        url: '/1/users/me'
      });
    } catch(error) {
      throw error;
    }
  }
  /**
   * ### updateProfile
   * for this user, update their record
   * the data is already in JSON format
   */
  async updateProfile(userId,data) {
    try {
      return await this._fetch({
        method: 'PUT',
        url: '/1/users/' + userId,
        body: data
      });
    } catch(error) {
      throw error;
    }
  }  
  /**
   * ### _fetch
   * A generic function that prepares the request to Parse.com
   */  
  async _fetch(opts) {
    opts = _.extend({
      method: 'GET',
      url: null,
      body: null,
      callback: null
    }, opts);

    var reqOpts = {
      method: opts.method,
      headers: {
        'X-Parse-Application-Id': this._applicationId,
        'X-Parse-REST-API-Key': this._restAPIKey
      }
    };
    if (this._sessionToken) {
      reqOpts.headers['X-Parse-Session-Token'] = this._sessionToken;
    }
    
    if (this._masterKey) {
      reqOpts.headers['X-Parse-Master-Key'] = this.masterKey;
    }

    if (opts.method === 'POST' || opts.method === 'PUT') {
      reqOpts.headers['Accept'] = 'application/json';
      reqOpts.headers['Content-Type'] = 'application/json';
    }

    if (opts.body) {
      reqOpts.body = JSON.stringify(opts.body);
    }

    return await fetch(this.API_BASE_URL + opts.url, reqOpts);

  }
};

