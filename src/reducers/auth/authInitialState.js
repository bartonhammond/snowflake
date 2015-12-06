import {Record} from 'immutable';
import {
  LOGIN_STATE_REGISTER
} from '../../lib/constants';

const Form = Record({
  state: LOGIN_STATE_REGISTER,
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
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

var InitialState = Record({
  form: new Form
});
export default InitialState;

