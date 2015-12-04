'use strict';

import {
  LOGIN_STATE_LOGOUT,
  LOGIN_STATE_REGISTER,
  LOGIN_STATE_LOGIN,
  LOGIN_STATE_FORGOT_PASSWORD,
} from '../../lib/constants';

export default function formValidation (state) {

  switch(state.form.state) {
  case LOGIN_STATE_LOGOUT:
    return state.setIn(['form','isValid'],true);
    
  case LOGIN_STATE_REGISTER:
    if (state.form.fields.username != ''
        &&
        state.form.fields.email !== ''
        &&
        state.form.fields.password !== ''
        &&
        state.form.fields.passwordAgain !== ''
        &&
        !state.form.fields.usernameHasError
        &&
        !state.form.fields.emailHasError
        &&
        !state.form.fields.passwordHasError
        &&
        !state.form.fields.passwordAgainHasError) {
      return state.setIn(['form','isValid'],true);
    } else {
      return state.setIn(['form','isValid'],false);
    }

  case LOGIN_STATE_LOGIN:
    if (state.form.fields.username !== ''
        &&
        state.form.fields.password !== ''
        &&
        !state.form.fields.usernameHasError
        &&
        !state.form.fields.passwordHasError) {
      return state.setIn(['form','isValid'],true);
    } else {
      return state.setIn(['form','isValid'],false);
    }
    
  case LOGIN_STATE_FORGOT_PASSWORD:
    if (state.form.fields.email !== ''
        &&
        !state.form.fields.emailHasError){ 
      return state.setIn(['form','isValid'],true);
    } else {
      return state.setIn(['form','isValid'],false);
    }

    
  }
  return state;

}
