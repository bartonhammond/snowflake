import {Record} from 'immutable';
import {
  
} from '../../lib/constants';

const Form = Record({
  originalProfile: new(Record({
    username: null,
    email: null,
    objectId: null,
    emailVerified: null
  })),
  disabled: false,
  error: null,
  isValid: false,
  isFetching: true,
  fields: new (Record({
    username: '',
    usernameHasError: false,
    email: '',
    emailHasError: false,
    emailVerified: false
  }))
});

export default Form;
