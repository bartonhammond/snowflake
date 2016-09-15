/**
 * # deviceActions-test.js
 *
 * This test is for deviceActions
 *
 */

'use strict'

/**
 * ## Mocks
 *
 * We don't want to use the devices storage, nor actually call
 * the server
 *
 */
jest.mock('../../../lib/AppAuthToken')
jest.mock('../../../lib/BackendFactory')

/**
 * ## Class under test
 *
 */
var actions = require('../deviceActions')

/**
 * ## Imports
 *
 * actions under test
 */
const {
  SET_PLATFORM,
  SET_VERSION
} = require('../../../lib/constants').default

/**
 * ## Tests
 *
 * deviceActions
 */
describe('deviceActions', () => {
  it('should setPlatform', () => {
    let platform = 'ios'
    expect(actions.setPlatform(platform)).toEqual({
      type: SET_PLATFORM,
      payload: platform
    })
  })

  it('should setVersion', () => {
    let version = '0.0.8'
    expect(actions.setVersion(version)).toEqual({
      type: SET_VERSION,
      payload: version
    })
  })
})

