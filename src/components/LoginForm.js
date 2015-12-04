'use strict';

import React,
{
  PropTypes
} from 'react-native';

import {
  LOGIN_STATE_REGISTER,
  LOGIN_STATE_LOGIN,
  LOGIN_STATE_FORGOT_PASSWORD,
} from '../lib/constants';

import t from 'tcomb-form-native';
let Form = t.form.Form;
var LoginForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func
  },

  render() {
    let options = {
      auto: 'placeholders',
      fields: {

      }
    };

    let username = {
      label: 'Username',
      maxLength: 12,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.usernameHasError,
      error: 'Must have 6-12 characters and/or numbers'
    };
    
    let email = {
      label: 'Email',
      keyboardType: 'email-address',
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.emailHasError,
      error: 'Please enter valid email'
    };

    let secureTextEntry = !this.props.form.fields.showPassword;

    let password = {
      label: 'Password',
      maxLength: 12,
      secureTextEntry: secureTextEntry,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.passwordHasError,
      error: 'Must have 6-12 characters with at least 1 number and 1 special character'
    };

    let passwordAgain= {
      label: 'Please enter password again',
      secureTextEntry: secureTextEntry,
      maxLength: 12,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.passwordAgainHasError,
      error: 'Passwords must match'
    };

    let loginForm;
    switch(this.props.form.state) {
      
    case(LOGIN_STATE_REGISTER):
        loginForm = t.struct({
          username: t.String,
          email: t.String,
          password: t.String,
          passwordAgain: t.String
        });
        options.fields['username'] = username;
        options.fields['email'] = email;
        options.fields['password'] = password;
        options.fields['passwordAgain'] = passwordAgain;
        break;
        
      case(LOGIN_STATE_LOGIN):
        loginForm = t.struct({
          username: t.String,
          password: t.String
        });
        options.fields['username'] = username;
        options.fields['password'] = password;
        break;
        
      case(LOGIN_STATE_FORGOT_PASSWORD):
        loginForm = t.struct({
          email: t.String
        });
        options.fields['email'] = email;
        break;
    } //switch

    return (
        <Form
            ref="form"
            type={loginForm}
            options={options}
            value={this.props.value}
            onChange={this.props.onChange}
        />

    );
  }
});

module.exports = LoginForm;

