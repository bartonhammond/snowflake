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

'use strict'

jest.mock('tcomb-form-native', () => {
  const React = require('React')
  const t = require.requireActual('tcomb-form-native')
  // Patch the base Component class to make rendering possible.
  t.form.Component.prototype.render = function render () {
    return React.createElement(this.getTemplate().name, this.props)
  }
  return t
})

import 'react-native'
import React from 'react'

import LoginForm from '../LoginForm'

import ReactTestUtils from 'react-addons-test-utils'
const renderer = ReactTestUtils.createRenderer()

const {
  REGISTER,
  LOGIN,
  FORGOT_PASSWORD
} = require('../../lib/constants').default
/**
 * ## Test
 */
describe('LoginForm', () => {
  /**
   * ### snapshotForm
   *
   * Depending on the state, this function validates that the rendered
   * component has the correct data
   */
  function snapshotForm (props) {
    renderer.render(<LoginForm {...props} />)
    const tree = renderer.getRenderOutput()
    expect(tree).toMatchSnapshot()
  }
  /**
   * ## Test Registration
   */
  describe('REGISTER', () => {
    /**
     * ### it should display without errors and without value
     * change the props and call ```snapshotForm``` to validate
     */
    it('should display without errors and without values', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: false,
          emailHasError: false,
          passwordHasError: false,
          passwordAgainHasError: false,
          showPassword: false
        }
      }

      let value = {
        username: '',
        email: '',
        password: '',
        passwordAgain: ''
      }

      let props = {
        form: form,
        formType: REGISTER,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
    /**
     * ### it should display  errors and  value
     * change the props and call ```snapshotForm``` to validate
     */
    it('should display  errors and  values', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: true,
          emailHasError: true,
          passwordHasError: true,
          passwordAgainHasError: true,
          showPassword: false
        }
      }

      let value = {
        username: 'username',
        email: 'email',
        password: 'password',
        passwordAgain: 'passwordagain'
      }

      let props = {
        form: form,
        formType: REGISTER,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
    /**
     * ### it should not be editable if fetching
     * change the props and call ```snapshotForm``` to validate
     */
    it('should not be editable if fetching', () => {
      let form = {
        isFetching: true,
        fields: {
          usernameHasError: true,
          emailHasError: true,
          passwordHasError: true,
          passwordAgainHasError: true,
          showPassword: false
        }
      }

      let value = {
        username: 'username',
        email: 'email',
        password: 'password',
        passwordAgain: 'passwordagain'
      }

      let props = {
        form: form,
        formType: REGISTER,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
    /**
     * ### the password fields are not secured if shown
     * change the props and call ```snapshotForm``` to validate
     */
    it('password fields are not secured if shown', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: false,
          emailHasError: false,
          passwordHasError: false,
          passwordAgainHasError: false,
          showPassword: true
        }
      }

      let value = {
        username: 'username',
        email: 'email',
        password: 'password',
        passwordAgain: 'passwordagain'
      }

      let props = {
        form: form,
        formType: REGISTER,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
  })

  /**
   * ## Test Log in
   */
  describe('LOGIN', () => {
    /**
     * ### it should display without errors and without value
     * change the props and call ```snapshotForm``` to validate
     */
    it('should display without errors and without values', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: false,
          passwordHasError: false,
          showPassword: false
        }
      }

      let value = {
        username: '',
        password: ''
      }

      let props = {
        form: form,
        formType: LOGIN,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
    /**
     * ### it should display  errors and  values
     * change the props and call ```snapshotForm``` to validate
     */
    it('should display  errors and  values', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: true,
          passwordHasError: true
        }
      }

      let value = {
        username: 'username',
        password: 'password'
      }

      let props = {
        form: form,
        formType: LOGIN,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
    /**
     * ### it should not be editable if fetching
     * change the props and call ```snapshotForm``` to validate
     */
    it('should not be editable if fetching', () => {
      let form = {
        isFetching: true,
        fields: {
          usernameHasError: true,
          passwordHasError: true,
          showPassword: false
        }
      }

      let value = {
        username: 'username',
        password: 'password'
      }

      let props = {
        form: form,
        formType: LOGIN,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
    /**
     * ### password fields are not secured if shown
     * change the props and call ```snapshotForm``` to validate
     */
    it('password fields are not secured if shown', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: false,
          passwordHasError: false,
          showPassword: true
        }
      }

      let value = {
        username: 'username',
        password: 'password'
      }

      let props = {
        form: form,
        formType: LOGIN,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
  })
  /**
   * ## Test reset password
   */
  describe('FORGOT_PASSWORD', () => {
    /**
     * ### it should display without errors and without values
     * change the props and call ```snapshotForm``` to validate
     */
    it('should display without errors and without values', () => {
      let form = {
        isFetching: false,
        fields: {
          emailHasError: false,
          showPassword: false
        }
      }

      let value = {
        email: ''
      }

      let props = {
        form: form,
        formType: FORGOT_PASSWORD,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
    /**
     * ### register password fields are not secured if shown
     * change the props and call ```snapshotForm``` to validate
     */
    it('should display  errors and  values', () => {
      let form = {
        isFetching: false,
        fields: {
          emailHasError: true
        }
      }

      let value = {
        email: 'email'
      }

      let props = {
        form: form,
        formType: FORGOT_PASSWORD,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })

    /**
     * ### it should not be editable if fetching
     * change the props and call ```snapshotForm``` to validate
     */
    it('should not be editable if fetching', () => {
      let form = {
        isFetching: true,
        fields: {
          emailHasError: true,
          showPassword: false
        }
      }

      let value = {
        username: 'username',
        password: 'password'
      }

      let props = {
        form: form,
        formType: LOGIN,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })

    /**
     * ### password fields are not secured if shown
     * change the props and call ```snapshotForm``` to validate
     */
    it('password fields are not secured if shown', () => {
      let form = {
        isFetching: false,
        fields: {
          emailHasError: false,
          showPassword: true
        }
      }

      let value = {
        email: 'email'
      }

      let props = {
        form: form,
        formType: FORGOT_PASSWORD,
        value: value,
        onChange: () => {}
      }

      snapshotForm(props)
    })
  })
})// describe LoginFormTest
