/**
 * # authFormValidation.js
 * 
 * This class determines only if the form is valid 
 * so that the form button can be enabled.
 * if all the fields on the form are without error,
 * the form is considered valid
 */
'use strict';

/**
 * ## formValidation
 * @param {Object} state - the Redux state object
 *
 * As there are only two fields, the form is valid if they are
 */
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










