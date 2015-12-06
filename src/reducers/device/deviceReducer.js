import InitialState from './deviceInitialState';

import {
  SET_PLATFORM,
  SET_VERSION,
  SET_STATE
} from '../../lib/constants';

const initialState = new InitialState;

export default function deviceReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state);

  switch (action.type) {

  case SET_PLATFORM: 
    const {platform} = action.payload;
    return state.set('platform', platform);


  case SET_VERSION: 
    const {version} = action.payload;
    return state.set('version', version);


  case SET_STATE:
    const device = JSON.parse(action.payload).device;
    var next = state.set('isMobile',device.isMobile)
          .set('platform',device.platform)
          .set('version',device.version);
    return next;
  }

  return state;
}
