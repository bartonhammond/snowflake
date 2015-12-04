'use strict';

import {

} from '../../lib/constants';

export default function formValidation (state) {
    if (state.form.fields.username != ''
        &&
        state.form.fields.email !== ''
        &&
        !state.form.fields.usernameHasError
        &&
        !state.form.fields.emailHasError
        &&
        (state.form.fields.username != state.form.originalProfile.username
        ||
         state.form.fields.email != state.form.originalProfile.email)
       ) {
      return state.setIn(['form','isValid'],true);
    } else {
      return state.setIn(['form','isValid'],false);
    }
    
  return state;

}










