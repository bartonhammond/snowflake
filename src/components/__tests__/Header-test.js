/**
 * # Header-test.js
 *
 * This class tests that the Header component displays correctly
 *
 * *Note:* if you want to understand the structures here, add a
 * ```console.log``` and then ```npm test```.
 *
 */
'use strict'

jest.mock('ActivityIndicator', () => 'ActivityIndicator')

/**
* ## Imports
*/
import 'react-native'
import React from 'react'

import Header from '../Header'

import renderer from 'react/lib/ReactTestRenderer'

/**
 * ## Test
 */
describe('Header', () => {
  /**
   * ### it should be display empty text when not fetching
   * render the header when not fetching
   */
  it('should be display empty text when not fetching', () => {
    const props = {
      isFetching: false
    }
    const tree = renderer.create(<Header {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
  /**
   * ### it should be display spinner when fetching
   * When fetching, the GiftedSpinner should display
   */
  it('should be display spinner when fetching', () => {
    const props = {
      isFetching: true
    }

    const tree = renderer.create(<Header {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})// describe Header
