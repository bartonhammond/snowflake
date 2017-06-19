/**
 * # profileActions.js
 *
 * All the request actions have 3 variations, the request, a success
 * and a failure. They all follow the pattern that the request will
 * set the ```isFetching``` to true and the whether it's successful or
 * fails, setting it back to false.
 *
 */
'use strict'

/**
 * ## Mocks
 *
 * turn mocking off but mock AppAuthToken and BackendFactory
 * also mock the router (see src/__mocks__)
 *
 */
jest.mock('../../../lib/AppAuthToken')
jest.mock('../../../lib/BackendFactory')
jest.mock('react-native-router-flux')
/**
 * ## Store
 * The mockStore will validate the actions are performed
 */
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureStore(middlewares)
/**
 * ## Class under test
 *
 */
const actions = require('../profileActions')

/**
 * ## Actions to test
 */
const {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  ON_PROFILE_FORM_FIELD_CHANGE

} = require('../../../lib/constants').default

/**
 * ## Tests
 *
 * profileActions
 */
describe('profileActions', () => {
  /**
   * ### simple tests that prove the actions have the specific type
   */
  it('should getProfileRequest', () => {
    expect(actions.getProfileRequest()).toEqual({type: GET_PROFILE_REQUEST})
  })

  it('should getProfileSuccess', () => {
    var json = {json: true}
    expect(actions.getProfileSuccess(json)).toEqual({type:
                                                     GET_PROFILE_SUCCESS,
                                                     payload: json})
  })

  it('should getProfileFailure', () => {
    var json = {json: true}
    expect(actions.getProfileFailure(json)).toEqual({type:
                                                     GET_PROFILE_FAILURE,
                                                     payload: json})
  })

  it('should profileUpdateRequest', () => {
    expect(actions.profileUpdateRequest()).toEqual({type: PROFILE_UPDATE_REQUEST})
  })

  it('should profileUpdateSuccess', () => {
    expect(actions.profileUpdateSuccess()).toEqual({type: PROFILE_UPDATE_SUCCESS})
  })

  it('should profileUpdateFailure', () => {
    var json = {json: true}
    expect(actions.profileUpdateFailure(json)).toEqual({type:
                                                        PROFILE_UPDATE_FAILURE,
                                                        payload: json})
  })

  it('should onProfileFormFieldChange', () => {
    let field = 'field'
    let value = 'value'
    expect(actions.onProfileFormFieldChange(field, value)).toEqual({
      type: ON_PROFILE_FORM_FIELD_CHANGE, payload: {field: field, value: value}})
  })

  /**
   * ### async tests
   *
   * the following tests describe the actions that should be
   * dispatched the function is invoked
   *
   * *Note*: these tests are run with ```pit``` because they are async
   *
   */
  it('should getProfile', () => {
    const expectedActions = [
      {type: GET_PROFILE_REQUEST},
      {type: GET_PROFILE_SUCCESS}
    ]

    const store = mockStore({})
    return store.dispatch(actions.getProfile())
      .then(() => {
        expect(store.getActions()[0].type).toEqual(expectedActions[0].type)
        expect(store.getActions()[1].type).toEqual(expectedActions[1].type)
      })
  })

  it('should updateProfile', () => {
    const expectedActions = [
      {type: PROFILE_UPDATE_REQUEST},
      {type: PROFILE_UPDATE_SUCCESS},
      {type: GET_PROFILE_REQUEST}
    ]

    const store = mockStore({})
    return store.dispatch(actions.updateProfile('userid', 'username', 'email'))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
