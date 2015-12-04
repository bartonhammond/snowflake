import {Record} from 'immutable';
import {
  LOGIN_STATE_REGISTER
} from '../../lib/constants';

const Form = Record({
  state: LOGIN_STATE_REGISTER,
  disabled: false,
  error: null,
  isValid: false,
  isFetching: true,
  fields: new (Record({
    username: '',
    usernameHasError: false,
    email: '',
    emailHasError: false,
    password: '',
    passwordHasError: false,
    passwordAgain: '',
    passwordAgainHasError: false,
    showPassword: false
  }))
});

export default Form;
