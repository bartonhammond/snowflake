'use strict';

jest.autoMockOff();

import React, { View } from 'react-native';
import utils from 'react-addons-test-utils';

jest.dontMock('../ItemCheckbox');
var ItemCheckbox = require('../ItemCheckbox');

describe('ItemCheckbox', () => {
  let iconName = {
    'true': 'check-square',
    'false': 'square-o'
  };
  
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

  function findTouchable(output) {
    return output.props.children.props;
  }
  
  function findIcon(output) {
    return output.children.props.children[0];
  }
  
  function findText(output) {
    return output.children.props.children[1];
  }
  
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
  
  it('if not disabled and checked, it should display check-square and text', () => {
    const props = {
      checked: true,
      text: 'TextShouldDisplay',
      disabled: false
    };
    testItemCheckbox(props);
  });

  it('if not disabled and not checked, it should display square-o and text', () => {
    const props = {
      checked: false,
      text: 'TextShouldDisplay',
      disabled: false
    };
    testItemCheckbox(props);
  });
  
  it('if disabled and checked, it should display check-square and text', () => {
    const props = {
      checked: true,
      text: 'TextShouldDisplay',
      disabled: true
    };
    testItemCheckbox(props);
  });

  it('if disabled and not checked, it should display square-o and text', () => {
    const props = {
      checked: false,
      text: 'TextShouldDisplay',
      disabled: true
    };
    testItemCheckbox(props);
  });

});//describe ItemCheckbox










