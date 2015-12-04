'use strict';
jest.autoMockOff();

jest.mock('react-native-simpledialog-android');

const SimpleAlert = require('react-native-simpledialog-android');

jest.dontMock('../ErrorAlert');
var ErrorAlert = require('../ErrorAlert');


describe('ErrorAlert', () => {
  it('should be fine', () => {

    const errorAlertProps = {
      error: {
        error: 'Error occurred'
      }
    };
      
    new ErrorAlert(SimpleAlert).checkError(errorAlertProps);
    expect(SimpleAlert.alert.mock.calls[0][0]).toEqual('Error');
    expect(SimpleAlert.alert.mock.calls[0][1]).toEqual(errorAlertProps.error.error);
  });


});//describe ErrorAlert
