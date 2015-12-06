'use strict';

import {
  SET_SESSION_TOKEN,
  SET_STORE,
  SET_STATE,
  GET_STATE
} from '../../lib/constants';

export function setSessionToken(sessionToken) {
  return {
    type: SET_SESSION_TOKEN,
    payload: sessionToken
  };
}

export function setStore(store) {
  return {
    type: SET_STORE,
    payload: store
  };
}

export function setState(newState) {
  return {
    type: SET_STATE,
    payload: newState
  };
}

export function getState(toggle) {
  return {
    type: GET_STATE,
    payload: toggle
  };
}
