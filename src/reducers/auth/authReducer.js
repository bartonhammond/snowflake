/**
 * # authReducer.js
 * 
 * The reducer for all the actions from the various log states
 */
'use strict';
/**
 * ## Imports
 * The InitialState for auth
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
const InitialState = require('./authInitialState').default;
const fieldValidation = require('../../lib/fieldValidation').default;
const formValidation = require('./authFormValidation').default;

/**
 * ## Auth actions
 */
const {
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  LOGIN_STATE_LOGOUT,
  LOGIN_STATE_REGISTER,
  LOGIN_STATE_LOGIN,
  LOGIN_STATE_FORGOT_PASSWORD,

  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  
  ON_AUTH_FORM_FIELD_CHANGE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,

  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,

  SET_STATE
} = require('../../lib/constants').default;

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

    /**
     * ### Requests start
     * set the form to fetching and clear any errors
     */
  case SESSION_TOKEN_REQUEST:
  case SIGNUP_REQUEST:
  case LOGOUT_REQUEST:
  case LOGIN_REQUEST:
  case RESET_PASSWORD_REQUEST:
    let nextState =  state.setIn(['form', 'isFetching'], true)
      .setIn(['form','error'],null);
    return nextState;

    /**
     * ### Logout state
     * The user has successfully access Parse.com
     * Clear the form's error and all the fields
     */
  case LOGIN_STATE_LOGOUT:
    return formValidation(
      state.setIn(['form', 'state'], action.type)
        .setIn(['form','error'],null)
        .setIn(['form','fields','username'],'')
        .setIn(['form','fields','email'],'')
        .setIn(['form','fields','password'],'')
        .setIn(['form','fields','passwordAgain'],'')
    );
    
    /**
     * ### Loggin in state
     * The user isn't logged in, and needs to 
     * login, register or reset password
     * 
     * Set the form state and clear any errors
     */
  case LOGIN_STATE_LOGIN:
  case LOGIN_STATE_REGISTER:
  case LOGIN_STATE_FORGOT_PASSWORD:
    return formValidation(
      state.setIn(['form', 'state'], action.type)
        .setIn(['form','error'],null)
    );
    
    /**
     * ### Auth form field change
     *
     * Set the form's field with the value
     * Clear the forms error
     * Pass the fieldValidation results to the
     * the formValidation
     */
  case ON_AUTH_FORM_FIELD_CHANGE: {
    const {field, value} = action.payload;
    let nextState =  state.setIn(['form', 'fields', field], value)
          .setIn(['form','error'],null);

    var finalState = formValidation(
      fieldValidation( nextState, action)
      , action);

    return finalState;
  }
    /**
     * ### Requests end, good or bad
     * Set the fetching flag so the forms will be enabled
     */
  case SESSION_TOKEN_SUCCESS:
  case SESSION_TOKEN_FAILURE:
  case SIGNUP_SUCCESS:
  case LOGIN_SUCCESS:
  case LOGOUT_SUCCESS:
  case RESET_PASSWORD_SUCCESS:
    return state.setIn(['form', 'isFetching'], false);

    /**
     * ### Access to Parse.com denied or failed
     * The fetching is done, but save the error
     * for display to the user
     */    
  case SIGNUP_FAILURE:
  case LOGOUT_FAILURE:
  case LOGIN_FAILURE:
  case RESET_PASSWORD_FAILURE:
    return state.setIn(['form', 'isFetching'], false)
      .setIn(['form', 'error'], action.payload);

    /**
     * ### Hot Loading support
     * 
     * Set all the field values from the payload
     */    
  case SET_STATE:
    var form = JSON.parse(action.payload).auth.form;
    
    var next = state.setIn(['form','state'],form.state)
          .setIn(['form','disabled'],form.disabled)
          .setIn(['form','error'], form.error)
          .setIn(['form','isValid'],form.isValid)
          .setIn(['form','isFetching'], form.isFetching)
          .setIn(['form','fields','username'],form.fields.username)
          .setIn(['form','fields','usernameHasError'],form.fields.usernameHasError)
          .setIn(['form','fields','email'],form.fields.email)
          .setIn(['form','fields','emailHasError'],form.fields.emailHasError)
          .setIn(['form','fields','password'],form.fields.password)
          .setIn(['form','fields','passwordHasError'],form.fields.passwordHasError)      
          .setIn(['form','fields','passwordAgain'],form.fields.passwordAgain)
          .setIn(['form','fields','passwordAgainHasError'],form.fields.passwordAgainHasError);
    
    return next;
    
  }    
  /**
   * ## Default
   */
  return state;
}
