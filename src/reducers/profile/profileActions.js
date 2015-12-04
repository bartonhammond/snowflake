'use strict';

import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  ON_PROFILE_FORM_FIELD_CHANGE
} from '../../lib/constants';

import Parse from '../../lib/Parse';
import AppAuthToken from '../../lib/AppAuthToken';


export function getProfileRequest() {
  return {
    type: GET_PROFILE_REQUEST
  };
}
export function getProfileSuccess(json) {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: json
  };
}
export function getProfileFailure(json) {
  return {
    type: GET_PROFILE_FAILURE,
    payload: json
  };
}

export function getProfile() {
  return dispatch => {
    dispatch(getProfileRequest());
    return new AppAuthToken().getSessionToken()
      .then((token) => {
        return new Parse(token.sessionToken.sessionToken).getProfile();
      })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);
        if (response.status === 200 || response.status === 201) {
          dispatch(getProfileSuccess(res));
        } else {
          dispatch(getProfileFailure(res));
        }
      })
      .catch((error) => {
        dispatch(getProfileFailure(error));
      });
  };
}

export function profileUpdateRequest() {
  return {
    type: PROFILE_UPDATE_REQUEST
  };
}
export function profileUpdateSuccess() {
  return {
    type: PROFILE_UPDATE_SUCCESS
  };
}
export function profileUpdateFailure(json) {
  return {
    type: PROFILE_UPDATE_FAILURE,
    payload: json
  };
}
export function updateProfile(userId, username, email) {
  return dispatch => {
    dispatch(profileUpdateRequest());
    return new AppAuthToken().getSessionToken()
      .then((token) => {
        return new
        Parse(token.sessionToken.sessionToken).updateProfile(userId,
          {
            username: username,
            email: email
          }
        );
      })
      .then((response) => {
        var  res = JSON.parse(response._bodyInit);
        if (response.status === 200 || response.status === 201) {
          dispatch(profileUpdateSuccess());
          dispatch(getProfile());
        } else {
          dispatch(profileUpdateFailure(res));
        }
      })
      .catch((error) => {
        dispatch(profileUpdateFailure(error));
      });
  };
}

export function onProfileFormFieldChange(field,value) {
  return {
    type: ON_PROFILE_FORM_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}
