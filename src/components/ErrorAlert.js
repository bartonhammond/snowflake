/**
 * # ErrorAlert.js
 *
 * This class uses a component which displays the appropriate alert
 * depending on the platform
 *
 * The main purpose here is to determine if there is an error and then
 * plucking off the message depending on the shape of the error object.
 */
'use strict';

/**
* ## Imports
*
*/
import SimpleAlert from 'react-native-simpledialog-android';
import  _ from 'underscore';

var ErrorAlert = class ErrorAlertClass{
  /**
   * ## ErrorAlert 
   * setup to support testing
   */
  constructor(alerter) {
    this.alerter = alerter;
  }
  /**
   * ### checkErro
   * determine if there is an error and how deep it is.  Take the
   * deepest level as the message and display it
   */
  checkError(obj) {
    if (!this.alerter) {
      this.alerter = SimpleAlert;
    }
    let errorMessage = '';
    if (!_.isNull(obj)) {
      if (!_.isUndefined(obj.error)) {
        if (!_.isUndefined(obj.error.error)) {
          errorMessage = obj.error.error;
        } else {
          errorMessage = obj.error;
        }
      } else {
        errorMessage = obj;
      }
      if (errorMessage !== '') {
        if (!_.isUndefined(errorMessage.message)) {
          this.alerter.alert('Error',errorMessage.message);
        } else {
          this.alerter.alert('Error',errorMessage);
        }
      }
    }//isNull
  }
};

module.exports = ErrorAlert;
