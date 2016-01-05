/**
 * # deviceReducer-test.js
 *
 * Test the deviceReducer's only function, like all reducers, where the
 * state and action are passed in.
 *
 * This will confirm that given a specific action with a type and
 * payload, that the state object is modified accordingly.
 *
 * *Note*: in this app,```state``` is an Immutable.js object
 *
 */
'use strict';

jest.autoMockOff();
/**
 * ## Imports
 *
 * These actions are sufficient to test the reducer as many of the
 * case statements are shared amongst the actions.
 */
const {
  SET_PLATFORM,
  SET_VERSION,
  SET_STATE
} = require('../../../lib/constants').default;

/**
 * ## Class under test
 *
 * Note that since autoMockOff has been called, we will get the actual
 * formValidation and fieldValidation objects, so we're testing them
 * as well
 */
const  deviceReducer = require('../deviceReducer').default;

/**
 * ## Tests
 *
 * deviceReducer
 */
describe('deviceReducer', () => {
  describe('init', () => {
    let initialState = null;

    beforeEach(() => {
      const action = {
        type: 'dummy'
      };
      initialState = deviceReducer(undefined, action);
    });

    it('sets platform to an empty string', () => {
      expect(initialState.platform).toEqual('');
    });

    it('sets isMobile to false', () => {
      expect(initialState.isMobile).toEqual(false);
    });

    it('sets version to null', () => {
      expect(initialState.version).toBeNull();
    });
  });

  describe('SET_PLATFORM', () => {
    it('modifies the platform and returns a new state', () => {
      let platform = 'ios';

      const action = {
        type: SET_PLATFORM,
        payload: platform
      };

      let next = deviceReducer(undefined, action);

      expect(next.platform).toEqual(platform);
    });
  });

  describe('SET_VERSION', () => {
    it('modifies the version and returns a new state', () => {
      let version = '0.0.8';

      const action = {
        type: SET_VERSION,
        payload: version
      };

      let next = deviceReducer(undefined, action);
      expect(next.version).toEqual(version);
    });
  });
});//deviceReducer

