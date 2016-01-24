/**
 * # ErrorAlert-test.js
 * This class validates that the SimpleAlert class will display the
 * correct error message
 *
 * *Note:* if you want to understand the structures here, add a
 * ```console.log``` and then ```npm test```.
 * 
 */
'use strict';
/**
 * ## Mock
 *  Mock the simpledialog, see: 'src/__mocks__/react-native-simpledialog-android.js'
 */

jest.autoMockOff();
jest.mock('react-native-simpledialog-android');

/**
 * This will load in the mocked version
 */
const SimpleAlert = require('react-native-simpledialog-android');

/**
 * ## Under test
 * Object under test
 */
jest.dontMock('../ErrorAlert');
var ErrorAlert = require('../ErrorAlert');

/**
 * ## Test
 */
describe('ErrorAlert', () => {
  it('should be fine', () => {
    /**
     * ### defaults
     */
    const errorAlertProps = {
      error: {
        error: 'Error occurred'
      }
    };
    
    /**
     * Invoke the ErrorAlert constructor and pass in the mocked
     * version
     * Then call the method that processes the error
     * check that the title is 'Error' which is a hard coded constant
     * and the alert matches the props error
     */
    new ErrorAlert().checkError(errorAlertProps);
    expect(SimpleAlert.alert.mock.calls[0][0]).toEqual('Error');
    expect(SimpleAlert.alert.mock.calls[0][1]).toEqual(errorAlertProps.error.error);
  });


});//describe ErrorAlert
