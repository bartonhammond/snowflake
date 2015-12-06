import {
  SET_SESSION_TOKEN,

  GET_PROFILE_SUCCESS,
  LOGIN_SUCCESS,

  GET_STATE,
  SET_STATE,
  SET_STORE
  
} from '../../lib/constants';

import InitialState from './globalInitialState';

const initialState = new InitialState;

export default function globalReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state);

  switch (action.type) {

  case SET_SESSION_TOKEN:
    return state.set('sessionToken', action.payload);

  case GET_PROFILE_SUCCESS:
  case LOGIN_SUCCESS:
    return state.set('currentUser',action.payload);

  case SET_STORE:
    return state.set('store',action.payload);
    
  case GET_STATE:
    let _state = state.store.getState();

    if (action.payload) {
      let newState = {};
      newState['auth'] = _state.auth.toJS();
      newState['device'] = _state.device.toJS();
      newState['profile'] = _state.profile.toJS();    
      newState['global'] = _state.global.set('store',null).toJS();

      return state.set('showState',action.payload)
        .set('currentState',newState);
    } else {
      return state.set('showState',action.payload);
    }

  case SET_STATE:
    var global = JSON.parse(action.payload).global;
    var next = state.set('currentUser', global.currentUser)
          .set('showState', false)
          .set('currentState', null);
    return next;

  }
  
  return state;
}
