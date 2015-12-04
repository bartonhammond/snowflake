'use strict';

jest.autoMockOff();

import {
  ON_PROFILE_FORM_FIELD_CHANGE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE
} from '../../../lib/constants';

const  profileReducer = require('../profileReducer');

describe('profileReducer', () => {
  describe('PROFILE_REQUEST', () => {

    it('starts fetching', () => {
      const action = {
        type: GET_PROFILE_REQUEST
      };
      let next = profileReducer(undefined, action);

      expect(next.form.isFetching).toBe(true);
      expect(next.form.error).toBe(null);
    });

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

  describe('PROFILE_UPDATE', () => {

    it('starts fetching on request', () => {
      const action = {
        type: PROFILE_UPDATE_REQUEST
      };
      let next = profileReducer(undefined, action);

      expect(next.form.isFetching).toBe(true);
      expect(next.form.error).toBe(null);
    });

    it('finishes fetching on success', () => {
      const action = {
        type: PROFILE_UPDATE_SUCCESS
      };
      let next = profileReducer(undefined, action);

      expect(next.form.isFetching).toBe(false);

    });
    
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

  describe('PROFILE_FORM_FIELD_CHANGE', () => {
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
