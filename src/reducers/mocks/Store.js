/**
 * # Store.js
 * 
 * This mocks the Redux store
 */
'use strict';
/**
 * ## Imports
 *
 * same middleWare as the app uses
 */
const { applyMiddleware } = require('redux');
const thunk = require('redux-thunk');


const middlewares = [thunk];

/**
 * ## mockStore
 *
 * @param {Object} state - initialState 
 * @param {Object} expectedActions - array of actions 
 * 
 * @see http://rackt.org/redux/docs/recipes/WritingTests.html
 */
export default function mockStore(state, expectedActions) {
  let expectedActionCount = expectedActions.length;
  let actualActionCount = 0;

  if (!Array.isArray(expectedActions)) {
    throw new Error('expectedActions should be an array of expected actions.');
  }
  /**
   * ### mockStoreWithoutMiddleware
   * 
   * if the state is a function, execute it
   */
  function mockStoreWithoutMiddleware() {
    return {
      getExpectedActionCount() {
        return expectedActionCount;
      },

      getActualActionCount() {
        return actualActionCount;
      },

      getState() {
        return typeof state === 'function' ? state() : state;
      },
      /**
       * #### dispatch
       * each time the action being tested, dispatches an action
       * confirm that it is in order, and that all of them have been processed
       */
      dispatch(action) {
        actualActionCount += 1;
        const expectedAction = expectedActions.shift();

        if (!expectedAction) {
          throw new Error('Additional action beyond expected dispatched: ' + action.type);
        }

        console.log(action.type);
        try {
          expect(action.type).toEqual(expectedAction.type);
          return action;
        } catch (e) {
          throw new Error(e);
        }
      }
    };
  }
  /**
   * ##  basic testing setup
   */
  const mockStoreWithMiddleware = applyMiddleware(
      ...middlewares
  )(mockStoreWithoutMiddleware);

  return mockStoreWithMiddleware();
}
