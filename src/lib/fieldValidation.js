'use strict';

import validate from 'validate.js';
import _ from 'underscore';

const emailConstraints = {
  from: {
    email: true
  }
};


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


export default function fieldValidation(state, action ) {
  const {field, value} = action.payload;
  
  switch(field) {
  case('username'):
    let validUsername  = _.isUndefined(validate({username: value},
                                                usernameConstraints));
    if (validUsername) {
      return state.setIn(['form', 'fields', 'usernameHasError'], false);
    } else {
      return state.setIn(['form', 'fields', 'usernameHasError'], true);
    }
    break;
    
  case('email'):
    let validEmail  = _.isUndefined(validate({from: value},
                                             emailConstraints));
    if (validEmail) {
        return state.setIn(['form', 'fields', 'emailHasError'], false);
    } else {
      return state.setIn(['form', 'fields', 'emailHasError'], true);
    }
    break;
    
  case('password'):
    let validPassword = _.isUndefined(validate({password: value},
                                               passwordConstraints));
    if (validPassword) {
      return state.setIn(['form', 'fields', 'passwordHasError'], false);
    } else {
      return state.setIn(['form', 'fields', 'passwordHasError'], true);
    }
    break;
    
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
    
  case('showPassword'):
    return state.setIn(['form', 'fields',
                                'showPassword'], value);
    break;
  }
  return state;

}
