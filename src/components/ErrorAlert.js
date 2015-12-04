'use strict';

import SimpleAlert from 'react-native-simpledialog-android';
import  _ from 'underscore';

var ErrorAlert = class ErrorAlertClass{
  constructor(alerter) {
    this.alerter = alerter;
  }
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
        this.alerter.alert('Error',errorMessage);
      }
    }//isNull
  }
};

module.exports = ErrorAlert;
