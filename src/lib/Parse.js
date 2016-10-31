/**
 * # Parse.js
 *
 * This class interfaces with parse-server using the rest api
 * see [https://parseplatform.github.io/docs/rest/guide/]
 *
 */
'use strict'

/**
 * ## Imports
 *
 * Config for defaults and underscore for a couple of features
 */
import CONFIG from './config'
import _ from 'underscore'
import Backend from './Backend'

export class Parse extends Backend {
  /**
   * ## Parse.js client
   *
   *
   * @throws tokenMissing if token is undefined
   */
  initialize (token) {
    if (!_.isNull(token) && _.isUndefined(token.sessionToken)) {
      throw new Error('TokenMissing')
    }
    this._sessionToken =
      _.isNull(token) ? null : token.sessionToken.sessionToken

    this._applicationId = CONFIG.PARSE.appId
    this._masterKey = CONFIG.PARSE.masterKey
    this.API_BASE_URL = CONFIG.backend.parseLocal
    ? CONFIG.PARSE.local.url
    : CONFIG.PARSE.remote.url
  }
  /**
   * ### signup
   *
   * @param data object
   *
   * {username: "barton", email: "foo@gmail.com", password: "Passw0rd!"}
   *
   * @return
   * if ok, res.json={createdAt: "2015-12-30T15:17:05.379Z",
   *   objectId: "5TgExo2wBA",
   *   sessionToken: "r:dEgdUkcs2ydMV9Y9mt8HcBrDM"}
   *
   * if error, {code: xxx, error: 'message'}
   */
  async signup (data) {
    return await this._fetch({
      method: 'POST',
      url: '/users',
      body: data
    })
      .then((res) => {
        return res.json().then(function (json) {
          if (res.status === 200 || res.status === 201) {
            return json
          } else {
            throw (json)
          }
        })
      })
      .catch((error) => {
        throw (error)
      })
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
  async login (data) {
    var formBody = []
    for (var property in data) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = encodeURIComponent(data[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    formBody = formBody.join('&')

    return await this._fetch({
      method: 'GET',
      url: '/login?' + formBody
    })
      .then((res) => {
        return res.json().then(function (json) {
          if (res.status === 200 || res.status === 201) {
            return json
          } else {
            throw (json)
          }
        })
      })
      .catch((error) => {
        throw (error)
      })
  }
  /**
   * ### logout
   * prepare the request and call _fetch
   */
  async logout () {
    return await this._fetch({
      method: 'POST',
      url: '/logout',
      body: {}
    })
      .then((res) => {
        if ((res.status === 200 ||
          res.status === 201 ||
          res.status === 400) ||
        (res.code === 209)) {
          return {}
        } else {
          throw new Error({code: 404, error: 'unknown error from Parse.com'})
        }
      })
      .catch((error) => {
        throw (error)
      })
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
  async resetPassword (data) {
    return await this._fetch({
      method: 'POST',
      url: '/requestPasswordReset',
      body: data
    })
      .then((res) => {
        return res.json().then(function (json) {
          if ((res.status === 200 || res.status === 201)) {
            return {}
          } else {
            throw (json)
          }
        })
      })
      .catch((error) => {
        throw (error)
      })
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
  async getProfile () {
    return await this._fetch({
      method: 'GET',
      url: '/users/me'
    })
     .then((response) => {
       return response.json().then(function (res) {
         if ((response.status === 200 || response.status === 201)) {
           return res
         } else {
           throw (res)
         }
       })
     })
      .catch((error) => {
        throw (error)
      })
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
  async updateProfile (userId, data) {
    return await this._fetch({
      method: 'PUT',
      url: '/users/' + userId,
      body: data
    })
      .then((res) => {
        if ((res.status === 200 || res.status === 201)) {
          return {}
        } else {
          res.json().then(function (res) {
            throw (res)
          })
        }
      })
      .catch((error) => {
        throw (error)
      })
  }
  /**
   * ### _fetch
   * A generic function that prepares the request
   * @returns object:
   *  {code: response.code
   *   status: response.status
   *   json: reponse.json()
   */
  async _fetch (opts) {
    opts = _.extend({
      method: 'GET',
      url: null,
      body: null,
      callback: null
    }, opts)

    var reqOpts = {
      method: opts.method,
      headers: {
        'X-Parse-Application-Id': this._applicationId,
        'X-Parse-REST-API-Key': this._restAPIKey
      }
    }
    if (this._sessionToken) {
      reqOpts.headers['X-Parse-Session-Token'] = this._sessionToken
    }

    if (this._masterKey) {
      reqOpts.headers['X-Parse-Master-Key'] = this.masterKey
    }

    if (opts.method === 'POST' || opts.method === 'PUT') {
      reqOpts.headers['Accept'] = 'application/json'
      reqOpts.headers['Content-Type'] = 'application/json'
    }

    if (opts.body) {
      reqOpts.body = JSON.stringify(opts.body)
    }

    return await fetch(this.API_BASE_URL + opts.url, reqOpts)
  }
}
// The singleton variable
export let parse = new Parse()
