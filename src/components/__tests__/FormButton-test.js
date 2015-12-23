/**
 * # FormButton-test.js
 * 
 * This class tests that the form button displays correctly
 *
 * *Note:* if you want to understand the structures here, add a
 * ```console.log``` and then ```npm test```.
 */
'use strict';

jest.autoMockOff();

/**
* ## Imports
 */

const React = require('react-native');
const { View } = React;

const utils = require('react-addons-test-utils');

/**
 * ## Under test
 * class under test
 */
jest.dontMock('../FormButton');
var FormButton = require('../FormButton');

/**
 * ## Test
 */
describe('FormButton', () => {
  let formButton;

  /**
   * ### defaults
   */ 
  const buttonProps = {
    self: this,
    isDisabled: false,
    onPress: () => {},
    buttonText: 'TestString'
  };
  
  /**
   * ### renderFormButton
   * render the component under test and return
   * @returns {Object} object with props, output and the renderer
   */
  function renderFormButton(props) {
    const renderer = utils.createRenderer();
    renderer.render(<FormButton {...props}/>);
    const output = renderer.getRenderOutput();

    return {
      props,
      output,
      renderer
    };
  }
  /**
   * ### beforeEach 
   * before each test, render the form button with the default props
   */
  beforeEach(() => {
    formButton = renderFormButton(buttonProps);
  });
  /**
   * ### it should be fine
   * the containing object should be a view
   */    
  it('should be fine', () => {
    const {output} = formButton;
    expect(output.type).toEqual(View);
  });

  /**
   * ### it should display text
   * the button should be disabled and have the correct text
   */
  it('should display text', () => {
    const {output} = formButton;
    const button = output.props.children;
    expect(button.props.isDisabled).toEqual(buttonProps.isDisabled);
    const buttonText = button.props.children;
    expect(buttonText).toEqual(buttonProps.buttonText);
  });
});//describe FormButton
