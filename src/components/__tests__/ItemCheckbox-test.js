/**
 * # ItemCheckbox-test.js
 *
 * This class tests that the ItemCheckbox renders correctly under
 * numerous conditions
 *
 * *Note:* if you want to understand the structures here, add a
 * ```console.log``` and then ```npm test```.
 *
 */
'use strict'

import 'react-native'
import React from 'react'

import ItemCheckbox from '../ItemCheckbox'

import renderer from 'react/lib/ReactTestRenderer'

/**
 * ## Test
 */
describe('ItemCheckbox', () => {
  /**
   * ### if not disabled and checked, it should display check-square and text
   * change the props and call ```testItemCheckbox``` to validate
   */
  it('if not disabled and checked, it should display check-square and text', () => {
    const props = {
      checked: true,
      text: 'TextShouldDisplay',
      disabled: false
    }
    const tree = renderer.create(<ItemCheckbox {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  /**
   * ### if not disabled and not checked, it should display square-o and text
   * change the props and call ```testItemCheckbox``` to validate
   */
  it('if not disabled and not checked, it should display square-o and text', () => {
    const props = {
      checked: false,
      text: 'TextShouldDisplay',
      disabled: false
    }
    const tree = renderer.create(<ItemCheckbox {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  /**
   * ### if disabled and checked, it should display check-square and text
   * change the props and call ```testItemCheckbox``` to validate
   */
  it('if disabled and checked, it should display check-square and text', () => {
    const props = {
      checked: true,
      text: 'TextShouldDisplay',
      disabled: true
    }
    const tree = renderer.create(<ItemCheckbox {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  /**
   * ### if disabled and not checked, it should display square-o and text
   * change the props and call ```testItemCheckbox``` to validate
   */
  it('if disabled and not checked, it should display square-o and text', () => {
    const props = {
      checked: false,
      text: 'TextShouldDisplay',
      disabled: true
    }
    const tree = renderer.create(<ItemCheckbox {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})// describe ItemCheckbox

