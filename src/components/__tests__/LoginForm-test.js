/**
 * # LoginForm-test.js
 * 
 * This class tests that the LoginForm renders correctly under
 * 4 states of the Login component, namely, logging in,
 * resetting the password and registration
 *
 * *Note:* if you want to understand the structures here, add a
 * ```console.log``` and then ```npm test```.
 *
 */

'use strict';

jest.autoMockOff();

/**
 * ## Imports
 * 
 * React is mocked in src/__mocks__/react-native.js
 */
const React = require('react-native');

const utils = require('react-addons-test-utils');

const {
  LOGIN_STATE_REGISTER,
  LOGIN_STATE_LOGIN,
  LOGIN_STATE_FORGOT_PASSWORD
} = require('../../lib/constants').default;

/**
 * ## Under test
 * class under test
 */
jest.dontMock('../LoginForm');
const LoginForm = require('../LoginForm');

/**
 * Included here, after dontMock so it's in all it's glory
 */
debugger;
var t = require('tcomb-form-native');
debugger;
var Form = t.form.Form;

console.log('starting');
/**
 * ## Test
 */
describe('LoginForm', () => {
  console.log('helo');
});//describe LoginFormTest
