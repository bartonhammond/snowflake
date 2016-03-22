/**
 * # Store.js
 * 
 * This mocks the Redux store
 */
'use strict';
/**
 * ## Imports
 *
 */

import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const middlewares = [thunk];

/**
 * ## mockStore
 *
 * 
 * @see https://github.com/reactjs/redux/blob/master/docs/recipes/WritingTests.md
 */
const mockStore = configureMockStore(middlewares);
  
module.exports = mockStore;
