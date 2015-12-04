'use strict';

import {
  SET_SESSION_TOKEN,
  SET_EVENT_EMITTER
} from '../../lib/constants';

export function setSessionToken(sessionToken) {
  return {
    type: SET_SESSION_TOKEN,
    payload: sessionToken
  };
}
export function setEventEmitter(eventEmitter) {
  return {
    type: SET_EVENT_EMITTER,
    payload: eventEmitter
  };
}
