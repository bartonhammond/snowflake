'use scrict';
import Form from './profileForm';
import {Record} from 'immutable';
import fieldValidation from '../../lib/fieldValidation';
import formValidation from './profileFormValidation';

import {
  ON_PROFILE_FORM_FIELD_CHANGE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE
} from '../../lib/constants';

const InitialState = Record({
  form: new Form
});
const initialState = new InitialState;

export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);

  switch (action.type) {
  case GET_PROFILE_REQUEST:
  case PROFILE_UPDATE_REQUEST:
    return state.setIn(['form', 'isFetching'], true)
      .setIn(['form','error'],null);

  case PROFILE_UPDATE_SUCCESS:
    return state.setIn(['form', 'isFetching'], false);
    
  case GET_PROFILE_SUCCESS:
    let nextProfileState = state.setIn(['form', 'isFetching'], false)
      .setIn(['form','fields','username'], action.payload.username)
      .setIn(['form','fields','email'], action.payload.email)
      .setIn(['form','fields','emailVerified'],
             action.payload.emailVerified)
      .setIn(['form','originalProfile','username'],action.payload.username)
      .setIn(['form','originalProfile','email'],action.payload.email)
      .setIn(['form','originalProfile','emailVerified'],action.payload.emailVerified)
      .setIn(['form','originalProfile','objectId'],action.payload.objectId)
      .setIn(['form','error'],null);
    
    return formValidation(
      fieldValidation( nextProfileState, action)
      , action);


  case GET_PROFILE_FAILURE:
  case PROFILE_UPDATE_FAILURE:
    return state.setIn(['form', 'isFetching'], false)
      .setIn(['form','error'], action.payload);

  case ON_PROFILE_FORM_FIELD_CHANGE:
    let nextFormState =
      state.setIn(['form', 'fields', 'username'],
                  action.payload.field.username)
      .setIn(['form', 'fields', 'email'], action.payload.field.email)
      .setIn(['form','error'],null);

    return formValidation(
      fieldValidation( nextFormState, action)
      , action);

    
  }//switch
  return state;
}
