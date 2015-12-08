/**
 * # Login.js
 * 
 * This class is a little complicated as it handles 4 states. It's also
 * a container so there is boilerplate from Redux similiar to ```App```.
 */
'use strict';

/**
 * ## Imports
 * 
 * validate and underscore
 *
 */
import validate from 'validate.js';
import _ from 'underscore';

/**
 * ## Email validation setup
 * Used for validation of emails
 */
const emailConstraints = {
  from: {
    email: true
  }
};

/**
* ## username validation rule
* read the message.. ;)
*/
const usernamePattern = /^[a-zA-Z0-9]{6,12}$/;
const usernameConstraints = {
  username: {
    format: {
      pattern: usernamePattern,
      flags: 'i',
      message: "must have 6-12 numbers, letters or special characters"
    }
  }
};

/**
* ## password validation rule
* read the message... ;)
*/
const passwordPattern =  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
const passwordConstraints = {
  password: {
    format: {
      pattern: passwordPattern,
      flags: "i",
      message: "have at least a number and a special character,"
          + " and between 6-12 in length"
    }
  }
};

const passwordAgainConstraints = {
  confirmPassword: {
    equality: "password"
  }
};

/**
 * ## Field Validation
 * @param {Object} state Redux state
 * @param {Object} action type & payload
 */
export default function fieldValidation(state, action ) {
  const {field, value} = action.payload;
  
  switch(field) {
    /**
     * ### username validation
     * set the form field error 
     */
  case('username'):
    let validUsername  = _.isUndefined(validate({username: value},
                                                usernameConstraints));
    if (validUsername) {
      return state.setIn(['form', 'fields', 'usernameHasError'], false);
    } else {
      return state.setIn(['form', 'fields', 'usernameHasError'], true);
    }
    break;
    
    /**
     * ### email validation
     * set the form field error 
     */    
  case('email'):
    let validEmail  = _.isUndefined(validate({from: value},
                                             emailConstraints));
    if (validEmail) {
        return state.setIn(['form', 'fields', 'emailHasError'], false);
    } else {
      return state.setIn(['form', 'fields', 'emailHasError'], true);
    }
    break;
    
    /**
     * ### password validation
     * set the form field error 
     */    
  case('password'):
    let validPassword = _.isUndefined(validate({password: value},
                                               passwordConstraints));
    if (validPassword) {
      return state.setIn(['form', 'fields', 'passwordHasError'], false);
    } else {
      return state.setIn(['form', 'fields', 'passwordHasError'], true);
    }
    break;
    
    /**
     * ### passwordAgain validation
     * set the form field error 
     */    
  case('passwordAgain'):
    var validPasswordAgain
      = _.isUndefined(validate({password: state.form.fields.password,
                                confirmPassword: value}, passwordAgainConstraints));
    if (validPasswordAgain) {
      return state.setIn(['form', 'fields', 'passwordAgainHasError'], false);
    } else {
      return  state.setIn(['form', 'fields', 'passwordAgainHasError'], true);
    }
    break;

    /**
     * ### showPassword
     * toggle the display of the password
     */    
  case('showPassword'):
    return state.setIn(['form', 'fields',
                                'showPassword'], value);
    break;
  }
  return state;

}
