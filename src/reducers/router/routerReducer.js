/**
 * # routerReducer.js
 *
 * The reducer for all the actions for the router states
 */
'use strict';

import {Actions} from 'react-native-router-flux';

export default function routerReducer (state = {}, action) {
  switch (action.type) {
		case Actions.BEFORE_ROUTE:
			return state;
		case Actions.AFTER_ROUTE:
			return state;
		case Actions.AFTER_POP:
			return state;
		case Actions.BEFORE_POP:
			return state;
		case Actions.AFTER_DISMISS:
			return state;
		case Actions.BEFORE_DISMISS:
			return state;
  	default:
  		return state;
  }
}
