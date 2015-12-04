import {Record} from 'immutable';
import {
  SET_SESSION_TOKEN,
  SET_EVENT_EMITTER,

  LOGGED_OUT,
  LOGGED_IN,

  EMIT_LOGGED_IN,
  EMIT_LOGGED_OUT,

  GET_PROFILE_SUCCESS,
  LOGIN_SUCCESS
} from '../../lib/constants';

const InitialState = Record({
  sessionToken: null,
  eventEmitter: null,
  currentUser: null
});
const initialState = new InitialState;

export default function globalReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state);

  switch (action.type) {

  case SET_SESSION_TOKEN:
    return state.set('sessionToken', action.payload);

  case SET_EVENT_EMITTER: 
    return state.set('eventEmitter', action.payload);

  case EMIT_LOGGED_IN:
    state.eventEmitter.emit(LOGGED_IN, { });
    break;
    
  case EMIT_LOGGED_OUT:
    state.eventEmitter.emit(LOGGED_OUT, { });
    break;

  case GET_PROFILE_SUCCESS:
  case LOGIN_SUCCESS:
    return state.set('currentUser',action.payload);
  }
  return state;
}










