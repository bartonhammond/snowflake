'use strict';

jest.autoMockOff();

import React, { View } from 'react-native';
import utils from 'react-addons-test-utils';

jest.dontMock('../FormButton');
var FormButton = require('../FormButton');

describe('FormButton', () => {
  let formButton;
  
  const buttonProps = {
    self: this,
    isDisabled: false,
    onPress: () => {},
    buttonText: 'TestString'
  };

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

  beforeEach(() => {
    formButton = renderFormButton(buttonProps);
  });

  it('should be fine', () => {
    const {output} = formButton;
    expect(output.type).toEqual(View);
  });

  it('should display text', () => {
    const {output} = formButton;
    const button = output.props.children;
    expect(button.props.isDisabled).toEqual(buttonProps.isDisabled);
    const buttonText = button.props.children;
    expect(buttonText).toEqual(buttonProps.buttonText);
  });
});//describe FormButton
