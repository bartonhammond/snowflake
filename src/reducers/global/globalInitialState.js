'use strict';
import {Record} from 'immutable';

var InitialState = Record({
  currentUser: null,
  showState: false,
  currentState: null,
  store: null
});
export default InitialState;
