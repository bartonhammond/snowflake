'use strict';

jest.autoMockOff();

jest.mock('../../../lib/AppAuthToken');
jest.mock('../../../lib/Parse');

var mockStore = require('../../mocks/Store');
var actions = require('../profileActions');

import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  ON_PROFILE_FORM_FIELD_CHANGE

} from '../../../lib/constants';

describe('authActions', () => {
  it('should getProfileRequest', () => {
    expect(actions.getProfileRequest()).toEqual({type: GET_PROFILE_REQUEST});
  });

  it('should getProfileSuccess', () => {
    var json = {json: true};
    expect(actions.getProfileSuccess(json)).toEqual({type:
                                                     GET_PROFILE_SUCCESS,
                                                     payload: json});
  });

  it('should getProfileFailure', () => {
    var json = {json: true};
    expect(actions.getProfileFailure(json)).toEqual({type:
                                                     GET_PROFILE_FAILURE,
                                                     payload:json});
  });
  
  it('should profileUpdateRequest', () => {
    expect(actions.profileUpdateRequest()).toEqual({type: PROFILE_UPDATE_REQUEST});
  });

  it('should profileUpdateSuccess', () => {
    expect(actions.profileUpdateSuccess()).toEqual({type: PROFILE_UPDATE_SUCCESS});
  });

  it('should profileUpdateFailure', () => {
    var json = {json: true};
    expect(actions.profileUpdateFailure(json)).toEqual({type:
                                                        PROFILE_UPDATE_FAILURE,
                                                        payload:json});
  });


  it('should onProfileFormFieldChange', () => {
    let field = 'field';
    let value = 'value';
    expect(actions.onProfileFormFieldChange(field, value)).toEqual({
      type: ON_PROFILE_FORM_FIELD_CHANGE,       payload: {field: field, value: value}});
  });


  pit('should getProfile', () => {
    
    const expectedActions = [
      {type: GET_PROFILE_REQUEST},
      {type: GET_PROFILE_SUCCESS}
    ];

    const store = mockStore({}, expectedActions);
    return store.dispatch(actions.getProfile());
  });

  pit('should updateProfile', () => {
    
    const expectedActions = [
      {type: PROFILE_UPDATE_REQUEST},
      {type: PROFILE_UPDATE_SUCCESS},
      {type: GET_PROFILE_REQUEST},
      {type: GET_PROFILE_SUCCESS}

    ];

    const store = mockStore({}, expectedActions);
    return store.dispatch(actions.updateProfile('userid','username','email'));
  });

});
