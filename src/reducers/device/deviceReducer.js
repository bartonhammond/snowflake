import * as actions from './deviceActions';
import {Record} from 'immutable';

const InitialState = Record({
  isMobile: false,
  platform: '',
  version: null
});
const initialState = new InitialState;

export default function deviceReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state);

  switch (action.type) {

    case actions.SET_PLATFORM: {
      const {platform} = action.payload;
      return state.set('platform', platform);
    }

    case actions.SET_VERSION: {
      const {version} = action.payload;
      return state.set('version', version);
    }

  }

  return state;
}
