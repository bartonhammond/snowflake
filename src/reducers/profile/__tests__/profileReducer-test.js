/**
 * # profileReducer-test.js
 * 
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
 * These actions of the users profile
 */
const {
  ON_PROFILE_FORM_FIELD_CHANGE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE
} = require('../../../lib/constants').default;

/**
 * ## Class under test
 *
 */
const  profileReducer = require('../profileReducer').default;
/**
 * ## Tests
 * 
 * profileReducer
 */
describe('profileReducer', () => {
  /**
   * ### Profile Request
   * 
   * *Note*: these tests call the ```profileReducer``` with an
   * ```undefined``` state so that the reducer will return a valid state.
   *
   */  
  describe('PROFILE_REQUEST', () => {
    /**
     * #### starts fetching
     *
     * Should have a valid form and no form error
     */
    it('starts fetching', () => {
      const action = {
        type: GET_PROFILE_REQUEST
      };
      let next = profileReducer(undefined, action);

      expect(next.form.isFetching).toBe(true);
      expect(next.form.error).toBe(null);
    });
    /**
     * #### it finishes fetching on success
     *
     * Should have a valid form and in the Logged out state
     *
     * We set the action to simulate valid data returning from
     * Parse.com
     *
     * We validate that after form and field validation, the values
     * are set.
     */
    it('finishes fetching on success', () => {
      const action = {
        type: GET_PROFILE_SUCCESS,
        payload: {
          username: 'barton',
          email: 'barton@foo.com',
          emailVerified: true,
          objectId: 'someObjectId'
        }
      };
      let next = profileReducer(undefined, action);

      expect(next.form.isFetching).toBe(false);
      expect(next.form.error).toBe(null);
      expect(next.form.fields.username, action.payload.username);
      expect(next.form.fields.email, action.payload.email);
      expect(next.form.fields.emailVerified,
             action.payload.emailVerified);

      expect(next.form.originalProfile.username, action.payload.username);
      expect(next.form.originalProfile.email, action.payload.email);
      expect(next.form.originalProfile.emailVerified, action.payload.emailVerified);

    });
    /**
     * #### finishes fetching on failure
     *
     * On failure, toggle the fetching flag and provide the error so
     * the use can see it
     */    
    it('finishes fetching on failure', () => {
      const action = {
        type: GET_PROFILE_FAILURE,
        payload: {error: 'error'}
      };
      let next = profileReducer(undefined, action);
      expect(next.form.isFetching).toBe(false);
      expect(next.form.error).toBe(action.payload);
    });

  });//Profile Request
  
  /**
   * ### Profile update
   * 
   */
  describe('PROFILE_UPDATE', () => {
    /**
     * #### starts fetching on request
     *
     * Should have a valid form and show that it's fetching
     */
    it('starts fetching on request', () => {
      const action = {
        type: PROFILE_UPDATE_REQUEST
      };
      let next = profileReducer(undefined, action);

      expect(next.form.isFetching).toBe(true);
      expect(next.form.error).toBe(null);
    });
    /**
     * #### finishes fetching on success
     *
     * Toggle fetching flag
     */
    it('finishes fetching on success', () => {
      const action = {
        type: PROFILE_UPDATE_SUCCESS
      };
      let next = profileReducer(undefined, action);

      expect(next.form.isFetching).toBe(false);

    });
    /**
     * #### finishes fetching on failure and saves error
     *
     * The fetching has ended and the error saved so the user can see
     * it
     */    
    it('finishes fetching on failure and saves error', () => {
      const action = {
        type: PROFILE_UPDATE_FAILURE,
        payload: {error: 'error'}
      };
      let next = profileReducer(undefined, action);
      expect(next.form.isFetching).toBe(false);
      expect(next.form.error).toBe(action.payload);
    });

  });//ProfileUpdate
  /**
   * ### Profile form field changes
   * 
   */
  describe('PROFILE_FORM_FIELD_CHANGE', () => {
    /**
     * #### form is valid to logout
     *
     * Should have a valid form and and the fields have no errors
     */    
    it('form is valid with valid email & username', () => {
      const action = {
        type: ON_PROFILE_FORM_FIELD_CHANGE,
        payload: {field: {username: 'barton', email: 'bar@ton.com'}}
      };
      let next = profileReducer(undefined,
                                action);
      
      expect(next.form.isValid,true);      
      expect(next.form.fields.username,
             action.payload.field.username);
      expect(next.form.fields.usernameHasError,false);
      expect(next.form.fields.email, action.payload.field.email);
      expect(next.form.fields.emailHasError, false);      
    });
    /**
     * #### form is invalid with invalid email & invalid username
     *
     * Bad data in, errors out!
     */    
    it('form is invalid with invalid email & invalid username', () => {
      const action = {
        type: ON_PROFILE_FORM_FIELD_CHANGE,
        payload: {field: {username: 'bart', email: 'bar.com'}}
      };
      let next = profileReducer(undefined,
                                action);

      expect(next.form.isValid,true);
      expect(next.form.fields.username,
             action.payload.field.username);
      expect(next.form.fields.usernameHasError,true);
      expect(next.form.fields.email, action.payload.field.email);
      expect(next.form.fields.emailHasError, true);

      
    });
    
  }); //FORM FIELD CHANGE
});//profileReducer
