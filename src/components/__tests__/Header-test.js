'use strict';

jest.autoMockOff();

import React, { View } from 'react-native';
import utils from 'react-addons-test-utils';

jest.dontMock('../Header');
var Header = require('../Header');

describe('Header', () => {
  let header;
  
  function renderHeader(props) {
    const renderer = utils.createRenderer();
    renderer.render(<Header {...props}/>);
    const output = renderer.getRenderOutput();

    return {
      props,
      output,
      renderer
    };
  }

  it('should be display empty text when not fetching', () => {
    const buttonProps = {
      isFetching: false
    };
    header = renderHeader(buttonProps);
    const {output} = header;
    expect(output.type).toEqual(View);
    expect(output.props.children[1].props.children).toEqual(' ');
  });
  
  it('should be display spinner when fetching', () => {
    const buttonProps = {
      isFetching: true
    };
    header = renderHeader(buttonProps);
    const {output} = header;
    expect(output.type).toEqual(View);
    expect(output.props.children[1].type.displayName).toEqual('GiftedSpinner');
  });

});//describe Header
