/**
 * # Header-test.js
 * 
 * This class tests that the Header component displays correctly
 *
 * *Note:* if you want to understand the structures here, add a
 * ```console.log``` and then ```npm test```.
 *
 */
'use strict';

jest.autoMockOff();

/**
* ## Imports
*/
import React, { View } from 'react-native';
import utils from 'react-addons-test-utils';

/**
 * ## Under test
 * class under test
 */
jest.dontMock('../Header');
var Header = require('../Header');

/**
 * ## Test
 */
describe('Header', () => {
  let header;
  
  /**
   * ### renderHeader
   * display component and return 
   * @returns {Object} with props, output and renderer
   */ 

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
  /**
   * ### it should be display empty text when not fetching
   * render the header when not fetching
   */    
  it('should be display empty text when not fetching', () => {
    const buttonProps = {
      isFetching: false
    };
    header = renderHeader(buttonProps);
    const {output} = header;
    expect(output.type).toEqual(View);
    expect(output.props.children[0].props.children[1].props.children).toEqual(' ');

  });
  /**
   * ### it should be display spinner when fetching
   * When fetching, the GiftedSpinner should display
   */    
  it('should be display spinner when fetching', () => {
    const buttonProps = {
      isFetching: true
    };
    header = renderHeader(buttonProps);
    const {output} = header;

    expect(output.type).toEqual(View);
    expect(output.props.children[0].props.children[1].type.displayName).toEqual('GiftedSpinner');
  });

});//describe Header
