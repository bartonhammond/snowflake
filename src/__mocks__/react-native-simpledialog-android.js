/**
 * # __mocks__/SimpleAlert.js
 * 
 * A simple mock for a simple class
 * 
 */
'use strict';

var SimpleAlert = {};

/**
 * ## Override the default behavior of the `alert` mock
 */

SimpleAlert.alert = jest.genMockFunction();

module.exports = SimpleAlert;
