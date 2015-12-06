'use strict';

import {
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

} from '../../lib/constants';

var  Parse = require('../../lib/Parse');
var  AppAuthToken = require('../../lib/AppAuthToken');

import _ from 'underscore';

export function logoutState() {
  return {
    type: LOGIN_STATE_LOGOUT
  };

}
export function registerState() {
  return {
    type: LOGIN_STATE_REGISTER
  };
}

export function loginState() {
  return {
    type: LOGIN_STATE_LOGIN
  };
}

export function forgotPasswordState() {
  return {
    type: LOGIN_STATE_FORGOT_PASSWORD
  };
}

export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST
  };
} 

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  };
} 
export function logoutFailure(error) {
  return {
    type: LOGOUT_FAILURE,
    payload: error
  };
} 

export function logout() {
  return dispatch => {
    dispatch(logoutRequest());
    return new AppAuthToken().getSessionToken()
      .then((token) => {
        if (!_.isUndefined(token.sessionToken)) {
          return new Parse(token.sessionToken.sessionToken).logout();
        } else {
          dispatch(loginState());
          dispatch(logoutSuccess());
          throw 'TokenMissing';
        }
      })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);
        if ((response.status === 200 || response.status === 201)
            || //invalid session token
            (response.status === 400 && res.code === 209)) {
          dispatch(registerState());
          dispatch(logoutSuccess());
          return response;
        } else {
          dispatch(logoutFailure(JSON.parse(response._bodyInit)));
          return response;
        }
      })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);
        if ((response.status === 200 || response.status === 201)
            || //invalid session token
            (response.status === 400 && res.code === 209)) {
          dispatch(deleteSessionToken());          
        }
      })
      .catch((error) => {
        dispatch(logoutFailure(error));
      });
  };

}

export function onAuthFormFieldChange(field,value) {
  return {
    type: ON_AUTH_FORM_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}
export function signupRequest() {
  return {
    type: SIGNUP_REQUEST
  };
} 
export function signupSuccess() {
  return {
    type: SIGNUP_SUCCESS
  };
}
export function sessionTokenRequest() {
  return {
    type: SESSION_TOKEN_REQUEST
  };
}
export function sessionTokenRequestSuccess(token) {
  return {
    type: SESSION_TOKEN_SUCCESS,
    payload: token
  };
}
export function sessionTokenRequestFailure(error) {
  return {
    type: SESSION_TOKEN_FAILURE,
    payload: _.isUndefined(error) ? null:error
  };
}

export function deleteSessionToken() {
  return dispatch => {
    dispatch(sessionTokenRequest());
    return new  AppAuthToken().deleteSessionToken()
      .then(() => {
        dispatch(sessionTokenRequestSuccess());
      });
  };
}

export function getSessionToken() {
  return dispatch => {
    dispatch(sessionTokenRequest());
    return new AppAuthToken().getSessionToken()
      .then((token) => {
        if (token) {
          dispatch(logoutState());
          dispatch(sessionTokenRequestSuccess(token));
        } else {
          dispatch(sessionTokenRequestFailure());
        }
      })
      .catch((error) => {
        dispatch(sessionTokenRequestFailure(error));
      });
  };
}

export function saveSessionToken(response, json) {
  return new AppAuthToken().storeSessionToken(json)
    .then(() => {
      return response;
    });
  
}

export function signupFailure(error) {
  return {
    type: SIGNUP_FAILURE,
    payload: error
  };
}
export function signup(username, email, password) {
  return dispatch => {
    dispatch(signupRequest());
    return new Parse().signup({
      username: username,
      email: email,
      password: password
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          let json = JSON.parse(response._bodyInit);
          return saveSessionToken(response,json);
        }
        return response;
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(logoutState());
          dispatch(signupSuccess());
        } else {
          dispatch(signupFailure(JSON.parse(response._bodyInit)));
        }
        return response;
      })
      .catch((error) => {
        dispatch(signupFailure(error));
      });
  };
}

export function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}

export function loginSuccess() {
  return {
    type: LOGIN_SUCCESS
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error
  };
}

export function login(username,  password) {
  return dispatch => {
    dispatch(loginRequest());
    return new Parse().login({
      username: username,
      password: password
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          var json = JSON.parse(response._bodyInit);
          return saveSessionToken(response, json);
        }
        return response;
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(logoutState());          
          dispatch(loginSuccess());
        } else {
          dispatch(loginFailure(JSON.parse(response._bodyInit)));
        }
        return response;
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });

  };
}

export function resetPasswordRequest() {
  return {
    type: RESET_PASSWORD_REQUEST
  };
}

export function resetPasswordSuccess() {
  return {
    type: RESET_PASSWORD_SUCCESS
  };
}

export function resetPasswordFailure(error) {
  return {
    type: RESET_PASSWORD_FAILURE,
    payload: error
  };
}

export function resetPassword(email) {
  return dispatch => {
    dispatch(resetPasswordRequest());
    return new Parse().resetPassword({
      email: email
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(loginState());
          dispatch(resetPasswordSuccess());
        } else {
          dispatch(resetPasswordFailure(JSON.parse(response._bodyInit)));
        }
        return response;
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
        }
      })
      .catch((error) => {
        dispatch(resetPasswordFailure(error));
      });

  };
}
