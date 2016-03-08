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
  REGISTER,
  LOGIN,
  FORGOT_PASSWORD
} = require('../../lib/constants').default;

/**
 * ## Under test
 * class under test
 */
jest.dontMock('../LoginForm');
var LoginForm = require('../LoginForm');

/**
 * Included here, after dontMock so it's in all it's glory
 */
var t = require('tcomb-form-native');
let Form = t.form.Form;

/**
 * ## Test
 */
describe('LoginForm', () => {

  /**
   * ### renderLoginForm
   * render the component under test and return
   * @returns {Object} object with props, output and the renderer
   */
  function renderLoginForm(props) {
    const renderer = utils.createRenderer();
    renderer.render(<LoginForm {...props}/>);
    const output = renderer.getRenderOutput();

    return {
      props,
      output,
      renderer
    };
  }
  /**
   * ### getFields
   * 
   * @returns {Object} fields
   */  
  function getFields(output) {
    return output.props.options.fields;
  }
  /**
   * ### renderLoginForm
   * render the component under test and return
   * @returns {Object} object with props, output and the renderer
   */
  function getValues(output) {
    return output.props.value;
  }
  /**
   * ### checkLoginForm
   *
   * Depending on the state, this function validates that the rendered
   * component has the correct data
   */
  function checkLoginForm(props) {
    const {output} = renderLoginForm(props);

    expect(output.type,Form);

    const fields = getFields(output);
    const values = getValues(output);
    
    if (props.form.state === REGISTER
        ||
        props.form.state === LOGIN) {

      expect(values.username).toEqual(props.value.username);      
      expect(fields.username.editable).toEqual(!props.form.isFetching);
      expect(fields.username.hasError).toEqual(props.form.fields.usernameHasError);

      expect(values.password).toEqual(props.value.password);      
      expect(fields.password.editable).toEqual(!props.form.isFetching);
      expect(fields.password.hasError).toEqual(props.form.fields.passwordHasError);    
      expect(fields.password.secureTextEntry).toEqual(!props.form.fields.showPassword);
    }
    
    if (props.form.state === FORGOT_PASSWORD
        ||
        props.form.state === REGISTER) {
      expect(values.email).toEqual(props.value.email);      
      expect(fields.email.editable).toEqual(!props.form.isFetching);
      expect(fields.email.hasError).toEqual(props.form.fields.emailHasError);
    }

    if (props.form.state === REGISTER) {
      expect(values.passwordAgain).toEqual(props.value.passwordAgain);          
      expect(fields.passwordAgain.editable).toEqual(!props.form.isFetching);
      expect(fields.passwordAgain.hasError).toEqual(props.form.fields.passwordAgainHasError);    
      expect(fields.passwordAgain.secureTextEntry).toEqual(!props.form.fields.showPassword);
    }

  }
  /**
   * ## Test Registration
   */
  describe('REGISTER', () => {
    /**
     * ### it should display without errors and without value
     * change the props and call ```checkLoginForm``` to validate
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
        },
        formType: REGISTER
      };

      let value = {
        username: '',
        email: '',
        password: '',
        passwordAgain: ''
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });
    /**
     * ### it should display  errors and  value
     * change the props and call ```checkLoginForm``` to validate
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
        },
        formType: REGISTER
      };

      let value = {
        username: 'username',
        email: 'email',
        password: 'password',
        passwordAgain: 'passwordagain'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });
    /**
     * ### it should not be editable if fetching
     * change the props and call ```checkLoginForm``` to validate
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
        },
        formType: REGISTER
      };

      let value = {
        username: 'username',
        email: 'email',
        password: 'password',
        passwordAgain: 'passwordagain'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });
    /**
     * ### the password fields are not secured if shown
     * change the props and call ```checkLoginForm``` to validate
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
        },
        formType: REGISTER
      };

      let value = {
        username: 'username',
        email: 'email',
        password: 'password',
        passwordAgain: 'passwordagain'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });

  });

  /**
   * ## Test Log in
   */  
  describe('LOGIN', () => {
    /**
     * ### it should display without errors and without value
     * change the props and call ```checkLoginForm``` to validate
     */      
    it('should display without errors and without values', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: false,
          passwordHasError: false,
          showPassword: false
        },
        formType: LOGIN
      };

      let value = {
        username: '',
        password: ''
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });
    /**
     * ### it should display  errors and  values
     * change the props and call ```checkLoginForm``` to validate
     */      
    it('should display  errors and  values', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: true,
          passwordHasError: true
        },
        formType: LOGIN
      };

      let value = {
        username: 'username',
        password: 'password'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });
    /**
     * ### it should not be editable if fetching
     * change the props and call ```checkLoginForm``` to validate
     */      
    it('should not be editable if fetching', () => {
      let form = {
        isFetching: true,
        fields: {
          usernameHasError: true,
          passwordHasError: true,
          showPassword: false
        },
        formType: LOGIN
      };

      let value = {
        username: 'username',
        password: 'password'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });
    /**
     * ### password fields are not secured if shown
     * change the props and call ```checkLoginForm``` to validate
     */      
    it('password fields are not secured if shown', () => {
      let form = {
        isFetching: false,
        fields: {
          usernameHasError: false,
          passwordHasError: false,
          showPassword: true
        },
        formType: LOGIN
      };

      let value = {
        username: 'username',
        password: 'password'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });

  });
  /**
   * ## Test reset password
   */
  describe('FORGOT_PASSWORD', () => {
    /**
     * ### it should display without errors and without values
     * change the props and call ```checkLoginForm``` to validate
     */      
    it('should display without errors and without values', () => {
      let form = {
        isFetching: false,
        fields: {
          emailHasError: false,
          showPassword: false
        },
        formType: FORGOT_PASSWORD
      };

      let value = {
        email: ''
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });
    /**
     * ### register password fields are not secured if shown
     * change the props and call ```checkLoginForm``` to validate
     */      
    it('should display  errors and  values', () => {
      let form = {
        isFetching: false,
        fields: {
          emailHasError: true
        },
        formType: FORGOT_PASSWORD
      };

      let value = {
        email: 'email'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });

    /**
     * ### it should not be editable if fetching
     * change the props and call ```checkLoginForm``` to validate
     */      
    it('should not be editable if fetching', () => {
      let form = {
        isFetching: true,
        fields: {
          emailHasError: true,
          showPassword: false
        },
        formType: LOGIN
      };

      let value = {
        username: 'username',
        password: 'password'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });

    /**
     * ### password fields are not secured if shown
     * change the props and call ```checkLoginForm``` to validate
     */      
    it('password fields are not secured if shown', () => {
      let form = {
        isFetching: false,
        fields: {
          emailHasError: false,
          showPassword: true
        },
        formType: FORGOT_PASSWORD
      };

      let value = {
        email: 'email'
      };
      
      let props = {
        form: form,
        value: value,
        onChange: () => {}
      };

      checkLoginForm(props);
    });

  });
  
});//describe LoginFormTest
