/**
 * # Parse.js
 * 
 * This class interfaces with Parse.com using the rest api
 * see [https://parse.com/docs/rest/guide](https://parse.com/docs/rest/guide)
 *
 */
'use strict';
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
import Backend from './Backend';

export default class Parse extends Backend{
  /**
   * ## Parse
   *
   * constructor sets the default keys required by Parse.com
   * if a user is logged in, we'll need the sessionToken
   *
   * @throws tokenMissing if token is undefined
   */
  constructor( token) {
    super(token);
    if (!_.isNull(token) && _.isUndefined(token.sessionToken)) {
      throw 'TokenMissing';
    }
    this._sessionToken =
      _.isNull(token) ?  null :  token.sessionToken.sessionToken;
    
    this._applicationId = CONFIG.PARSE.APP_ID;
    this._restAPIKey = CONFIG.PARSE.REST_API_KEY;
    this._masterKey = null;

    this.API_BASE_URL= 'https://api.parse.com';
  }
  /**
   * ### signup
   *
   * @param data object
   *
   * {username: "barton", email: "foo@gmail.com", password: "Passw0rd!"}
   *
   * @return
   * if ok, {createdAt: "2015-12-30T15:17:05.379Z",
   *   objectId: "5TgExo2wBA", 
   *   sessionToken: "r:dEgdUkcs2ydMV9Y9mt8HcBrDM"}
   *
   * if error, {code: xxx, error: 'message'}
   */
  async signup(data) {
    return await this._fetch({
      method: 'POST',
      url: '/1/users',
      body: data
    })
      .then((response) => {
        var json = JSON.parse(response._bodyInit);        
        if (response.status === 200 || response.status === 201) {
          return json;
        } else {
          throw(json);
        }
      })
      .catch((error) => {
        throw(error);
      });

  }
  /**
   * ### login
   * encode the data and and call _fetch
   *
   * @param data
   *
   *  {username: "barton", password: "Passw0rd!"}
   *
   * @returns
   *
   * createdAt: "2015-12-30T15:29:36.611Z"
   * email: "barton@foo.com"
   * objectId: "Z4yvP19OeL"
   * sessionToken: "r:Kt9wXIBWD0dNijNIq2u5rRllW"
   * updatedAt: "2015-12-30T16:08:50.419Z"
   * username: "barton"
   *
   */
  async login(data) {
    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return await this._fetch({
      method: 'GET',
      url: '/1/login?' + formBody
    })
      .then((response) => {
        var json = JSON.parse(response._bodyInit);
        if (response.status === 200 || response.status === 201) {
          return json;
        } else {
          throw(json);
        }
      })
      .catch((error) => {
        throw(error);
      });

  }
  /**
   * ### logout
   * prepare the request and call _fetch
   */  
  async logout() {
    return await this._fetch({
      method: 'POST',
      url: '/1/logout',
      body: {}
    })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);        
        if ((response.status === 200 || response.status === 201)
            || //invalid session token
            (response.status === 400 && res.code === 209)) {
          return {};
        } else {
          throw({code: 404, error: 'unknown error from Parse.com'});
        }
      })
      .catch((error) => {
        throw(error);
      });

  }
  /**
   * ### resetPassword
   * the data is already in a JSON format, so call _fetch
   *
   * @param data 
   * {email: "barton@foo.com"}
   *
   * @returns empty object
   *
   * if error:  {code: xxx, error: 'message'}
   */
  async resetPassword(data) {
    return await this._fetch({
      method: 'POST',
      url: '/1/requestPasswordReset',
      body: data
    })
      .then((response) => {
        if ((response.status === 200 || response.status === 201)) {
          return {};
        } else {
          var  res = JSON.parse(response._bodyInit);                  
          throw(res);
        }
      })
      .catch((error) => {
        throw(error);
      });
  }  
  /**
   * ### getProfile
   * Using the sessionToken, we'll get everything about
   * the current user.
   *
   * @returns
   *
   * if good:
   * {createdAt: "2015-12-30T15:29:36.611Z"
   *  email: "barton@acclivyx.com"
   *  objectId: "Z4yvP19OeL"
   *  sessionToken: "r:uFeYONgIsZMPyxOWVJ6VqJGqv"
   *  updatedAt: "2015-12-30T15:29:36.611Z"
   *  username: "barton"}
   *
   * if error, {code: xxx, error: 'message'}
   */
  async getProfile() {
    return await this._fetch({
      method: 'GET',
      url: '/1/users/me'
    })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);
        if ((response.status === 200 || response.status === 201)) {
          return res;
        } else {
          throw(res);
        }
      })
      .catch((error) => {
        throw(error);
      });
  }
  /**
   * ### updateProfile
   * for this user, update their record
   * the data is already in JSON format
   *
   * @param userId  _id of Parse.com
   * @param data object:
   * {username: "barton", email: "barton@foo.com"}
   */
  async updateProfile(userId,data) {
    return await this._fetch({
      method: 'PUT',
      url: '/1/users/' + userId,
      body: data
    })
      .then((response) => {
        if ((response.status === 200 || response.status === 201)) {
          return {};
        } else {
          var  res = JSON.parse(response._bodyInit);          
          throw(res);
        }
      })
      .catch((error) => {
        throw(error);
      });

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

