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
'use strict';

jest.autoMockOff();

/**
 * ## Imports
 *
 * React is mocked in src/__mocks__/react-native.js
 *
 * *Note*: put a ```console.log``` on the outputs to see the structures
 */

import React, { View } from 'react-native';
import utils from 'react-addons-test-utils';

/**
 * ## Under test
 * class under test
 */
jest.dontMock('../ItemCheckbox');
var ItemCheckbox = require('../ItemCheckbox');

/**
 * ## Test
 */
describe('ItemCheckbox', () => {
  let iconName = {
    'true': 'check-square',
    'false': 'square-o'
  };
  /**
   * ### renderItemCheckbox
   * render the component under test and return
   * @returns {Object} object with props, output and the renderer
   *
   */
  function renderItemCheckbox(props) {
    const renderer = utils.createRenderer();
    renderer.render(<ItemCheckbox {...props}/>);
    const output = renderer.getRenderOutput();

    return {
      props,
      output,
      renderer
    };
  }
  /**
   * ### findTouchable
   * @returns {Object} props the 
   */
  function findTouchable(output) {
    return output.props.children.props;
  }
  /**
   * ### findIcon
   * @returns {Object} that contains icon object
   */
  function findIcon(output) {
    return output.children.props.children[0];
  }
  /**
   * ### findText
   * @returns {Object} that contains the text object
   */
  function findText(output) {
    return output.children.props.children[1];
  }
  /**
   * ### testItemCheckbox
   *
   * @param {Object} props The object with fields:
   *
   * * checked
   * * text
   * * disabled
   *
   * Validate that the renderend componets displays correctly
   */
  function testItemCheckbox(props) {
    const {output} = renderItemCheckbox(props);
    expect(output.type).toEqual(View);

    const touchableWithoutFeedback =   findTouchable(output);
    if (props.disabled) {
      expect(typeof touchableWithoutFeedback.onPress).toEqual('undefined');
    } else {
      expect(typeof touchableWithoutFeedback.onPress).toEqual('function');
    }
    
    const icon = findIcon(touchableWithoutFeedback);
    expect(icon.props.name).toEqual(iconName[props.checked]);
    
    const text = findText(touchableWithoutFeedback);
    expect(text.props.children[1]).toEqual(props.text);
  }
  /**
   * ### if not disabled and checked, it should display check-square and text
   * change the props and call ```testItemCheckbox``` to validate
   */      
  it('if not disabled and checked, it should display check-square and text', () => {
    const props = {
      checked: true,
      text: 'TextShouldDisplay',
      disabled: false
    };
    testItemCheckbox(props);
  });

  /**
   * ### if not disabled and not checked, it should display square-o and text
   * change the props and call ```testItemCheckbox``` to validate
   */      
  it('if not disabled and not checked, it should display square-o and text', () => {
    const props = {
      checked: false,
      text: 'TextShouldDisplay',
      disabled: false
    };
    testItemCheckbox(props);
  });
  
  /**
   * ### if disabled and checked, it should display check-square and text
   * change the props and call ```testItemCheckbox``` to validate
   */        
  it('if disabled and checked, it should display check-square and text', () => {
    const props = {
      checked: true,
      text: 'TextShouldDisplay',
      disabled: true
    };
    testItemCheckbox(props);
  });
  
  /**
   * ### if disabled and not checked, it should display square-o and text
   * change the props and call ```testItemCheckbox``` to validate
   */      
  it('if disabled and not checked, it should display square-o and text', () => {
    const props = {
      checked: false,
      text: 'TextShouldDisplay',
      disabled: true
    };
    testItemCheckbox(props);
  });

});//describe ItemCheckbox










