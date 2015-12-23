/**
 * # profileActions.js
 * 
 * The actions to support the users profile
 */
'use strict';
/**
 * ## Imports
 * 
 * The actions for profile
 */
const {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  ON_PROFILE_FORM_FIELD_CHANGE
} = require('../../lib/constants').default;

/**
 * Parse for Parse.com
 * AppAuthToken for localStorage sessionToken access 
 */
const Parse = require( '../../lib/Parse').default;
const AppAuthToken = require('../../lib/AppAuthToken').default;

/**
 * ## retreiving profile actions
 */
export function getProfileRequest() {
  return {
    type: GET_PROFILE_REQUEST
  };
}
export function getProfileSuccess(json) {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: json
  };
}
export function getProfileFailure(json) {
  return {
    type: GET_PROFILE_FAILURE,
    payload: json
  };
}
/**
 * ## State actions
 * controls which form is displayed to the user
 * as in login, register, logout or reset password
 */
export function getProfile(sessionToken) {
  return dispatch => {
    dispatch(getProfileRequest());
    return new AppAuthToken().getSessionToken(sessionToken)
      .then((token) => {
        return new Parse(token.sessionToken.sessionToken).getProfile();
      })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);
        if (response.status === 200 || response.status === 201) {
          dispatch(getProfileSuccess(res));
        } else {
          dispatch(getProfileFailure(res));
        }
      })
      .catch((error) => {
        dispatch(getProfileFailure(error));
      });
  };
}
/**
 * ## State actions
 * controls which form is displayed to the user
 * as in login, register, logout or reset password
 */
export function profileUpdateRequest() {
  return {
    type: PROFILE_UPDATE_REQUEST
  };
}
export function profileUpdateSuccess() {
  return {
    type: PROFILE_UPDATE_SUCCESS
  };
}
export function profileUpdateFailure(json) {
  return {
    type: PROFILE_UPDATE_FAILURE,
    payload: json
  };
}
/**
 * ## updateProfile
 * @param {string} userId - the Parse.com objectId
 * @param {string} username - the users name
 * @param {string] email - user's email
 * @param {Object} sessionToken - the sessionToken from Parse.com
 *
 * The sessionToken is provided when Hot Loading.
 *
 * With the sessionToken, Parse.com is called with the data to update
 * If successful, get the profile so that the screen is updated with
 * the data as now persisted on Parse.com
 *
 */
export function updateProfile(userId, username, email, sessionToken) {
  return dispatch => {
    dispatch(profileUpdateRequest());
    return new AppAuthToken().getSessionToken(sessionToken)
      .then((token) => {
        return new
        Parse(token.sessionToken.sessionToken).updateProfile(userId,
          {
            username: username,
            email: email
          }
        );
      })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);
        if (response.status === 200 || response.status === 201) {
          dispatch(profileUpdateSuccess());
          dispatch(getProfile());
        } else {
          dispatch(profileUpdateFailure(res));
        }
      })
      .catch((error) => {
        dispatch(profileUpdateFailure(error));
      });
  };
}
/**
 * ## onProfileFormFieldChange
 * 
 */
export function onProfileFormFieldChange(field,value) {
  return {
    type: ON_PROFILE_FORM_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}
