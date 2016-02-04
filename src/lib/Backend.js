/**
 * # Backend.js
 * 
 * Abstract Base class for Backend support
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

export default class Backend {
  /**
   * ## Constructor
   *
   *
   * @throws tokenMissing if token is undefined
   */
  constructor( token) {
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

  }
  /**
   * ### logout
   * prepare the request and call _fetch
   */  
  async logout() {

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
  }  

};

