/**
 * # FormButton-test.js
 *
 * This class tests that the form button displays correctly
 *
 * *Note:* if you want to understand the structures here, add a
 * ```console.log``` and then ```npm test```.
 */
'use strict'

/**
* ## Imports
 */

import 'react-native'
import React from 'react'

import FormButton from '../FormButton'

import renderer from 'react/lib/ReactTestRenderer'

it('FormButton', () => {
  const props = {
    isDisabled: false,
    onPress: () => {},
    buttonText: 'TestString'
  }
  const tree = renderer.create(<FormButton {...props} />).toJSON()
  expect(tree).toMatchSnapshot()
})
