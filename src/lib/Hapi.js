/**
 * # Hapi.js
 * 
 * This class interfaces with Hapi.com using the rest api
 * see [http://hapijs.com/api](http://hapijs.com/api)
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

export default class Hapi extends Backend{
  /**
   * ## Hapi.js client
   *
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
    
    this.API_BASE_URL= CONFIG.backend.hapiLocal ?
      CONFIG.HAPI.local.url : CONFIG.HAPI.remote.url;
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
      url: '/account/register',
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
   * updatedAt: "2015-12-30T16:08:50.419Z"
   * objectId: "Z4yvP19OeL"
   * email: "barton@foo.com"
   * sessionToken: "r:Kt9wXIBWD0dNijNIq2u5rRllW"
   * username: "barton"
   *
   */
  async login(data) {
    return await this._fetch({
      method: 'POST',
      url: '/account/login',
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
   * ### logout
   * prepare the request and call _fetch
   */  
  async logout() {
    return await this._fetch({
      method: 'POST',
      url: '/account/logout',
      body: {}
    })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);        
        if ((response.status === 200 || response.status === 201)
            || //invalid session token
            (response.status === 400 && res.code === 209)) {
          return {};
        } else {
          throw({code: res.statusCode, error: res.message});
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
      url: '/account/resetPasswordRequest',
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
      url: '/account/profile/me'
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
      method: 'POST',
      url: '/account/profile/' + userId,
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
      }
    };
    
    if (this._sessionToken) {
      reqOpts.headers['Authorization'] = 'Bearer ' + this._sessionToken;
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

