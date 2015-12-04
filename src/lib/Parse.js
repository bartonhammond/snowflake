/*!
 * Parse.com restful API
 * 
 */
require('regenerator/runtime');
import CONFIG from './config';
import _ from 'underscore';

export default class Parse {
  constructor( sessionToken) { 
    this._applicationId = CONFIG.PARSE.APP_ID;
    this._restAPIKey = CONFIG.PARSE.REST_API_KEY;
    this._masterKey = null;
    this._sessionToken =
      _.isUndefined(sessionToken) ?  null :  sessionToken;
    this.API_BASE_URL= 'https://api.parse.com';
  }

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

