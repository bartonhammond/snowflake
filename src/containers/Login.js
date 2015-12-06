'use strict';

/**
 *  Thanks to: http://browniefed.com/blog/2015/06/07/react-native-layout-examples/
 *
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as authActions from '../reducers/auth/authActions';
import * as globalActions from '../reducers/global/globalActions';
import {Map} from 'immutable';
import Header from '../components/Header';
import ErrorAlert from '../components/ErrorAlert';
import FormButton from '../components/FormButton';
import LoginForm from '../components/LoginForm';
import React,
{
  Component,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
}
from 'react-native';

import ItemCheckbox from '../components/ItemCheckbox';

import {
  LOGIN_STATE_LOGOUT,
  LOGIN_STATE_REGISTER,
  LOGIN_STATE_LOGIN,
  LOGIN_STATE_FORGOT_PASSWORD,
} from '../lib/constants';


var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  inputs: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  }
});

const actions = [
  authActions,
  globalActions
];

function mapStateToProps(state) {
  return {
    ...state
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

    return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state ={
      value: {
        username: this.props.auth.form.fields.username,
        email: this.props.auth.form.fields.email,
        password: this.props.auth.form.fields.password,
        passwordAgain: this.props.auth.form.fields.passwordAgain
        }
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      value: {
        username: props.auth.form.fields.username,
        email: props.auth.form.fields.email,
        password: props.auth.form.fields.password,
        passwordAgain: props.auth.form.fields.passwordAgain
      }
    });
  }
  
  onChange(value) {
    if (value.username != '') {
      this.props.actions.onAuthFormFieldChange('username',value.username);
    }
    if (value.email != '') {
      this.props.actions.onAuthFormFieldChange('email',value.email);
    }
    if (value.password != '') {
      this.props.actions.onAuthFormFieldChange('password',value.password);
    }
    if (value.passwordAgain != '') {
      this.props.actions.onAuthFormFieldChange('passwordAgain',value.passwordAgain);
    }
    this.setState(
      {value}
    );

  }

  render() {
    this.errorAlert.checkError(this.props.auth.form.error);

    
    let forgotPassword =
    <TouchableHighlight
        onPress={() => this.props.actions.forgotPasswordState()} >
      <Text>Forgot Password?</Text>
    </TouchableHighlight>;

    let alreadyHaveAccount =
    <TouchableHighlight
        onPress={() => this.props.actions.loginState()}>
      <Text>Already have an account?</Text>
    </TouchableHighlight>;
    
    let register =
    <TouchableHighlight onPress={() => this.props.actions.registerState()}>
      <Text>Register</Text>
    </TouchableHighlight>;


    let self = this;
    let loginButtonText;
    let leftMessage;
    let rightMessage;
    let onButtonPress;
    let passwordDisplay = <Text/>;
    
    let itemCheckBox =
    <ItemCheckbox
        text="Show Password"
        disabled={this.props.auth.form.isFetching}
        onCheck={() => {
          this.props.actions.onAuthFormFieldChange('showPassword',true)}
        }
        onUncheck={() => {
          this.props.actions.onAuthFormFieldChange('showPassword',false)}
        }
    />;

    switch(this.props.auth.form.state) {
      case(LOGIN_STATE_LOGOUT):
        loginButtonText = 'Log out';
        onButtonPress = () => {
          this.props.actions.logout();
        };
        break;
        
      case(LOGIN_STATE_REGISTER):
        loginButtonText = 'Register';
        onButtonPress = () => {
          this.props.actions.signup(this.props.auth.form.fields.username,
                                    this.props.auth.form.fields.email,
                                    this.props.auth.form.fields.password);
        };
        passwordDisplay = itemCheckBox;
        leftMessage = forgotPassword;
        rightMessage = alreadyHaveAccount;
        break;
        
      case(LOGIN_STATE_LOGIN):
        loginButtonText = 'Log in';
        leftMessage = register;
        rightMessage = forgotPassword;
        onButtonPress = () => {
          this.props.actions.login(this.props.auth.form.fields.username, this.props.auth.form.fields.password);
        };
        passwordDisplay = itemCheckBox;
        break;

      case(LOGIN_STATE_FORGOT_PASSWORD):
        loginButtonText = 'Reset password';
        leftMessage = register;
        rightMessage = alreadyHaveAccount;
        onButtonPress = () => {
          this.props.actions.resetPassword(this.props.auth.form.fields.email);
        };
        break;
    }//switch
    
    if (this.props.auth.form.state === LOGIN_STATE_LOGOUT) {
      return (
        <View style={styles.container}>
          <View>
            <Header isFetching={this.props.auth.form.isFetching}
                    showState={this.props.global.showState}
                    currentState={this.props.global.currentState}
                    onGetState={this.props.actions.getState}
                    onSetState={this.props.actions.setState}
            />
              <FormButton
                  isDisabled={!this.props.auth.form.isValid || this.props.auth.form.isFetching}
                  onPress={onButtonPress.bind(self)}
                  buttonText={loginButtonText}/>
            </View>
          </View>
        );
    } else {
        return (
          <View style={styles.container}>
            <View>
              <Header isFetching={this.props.auth.form.isFetching}
                      showState={this.props.global.showState}
                      currentState={this.props.global.currentState}
                      onGetState={this.props.actions.getState}
                      onSetState={this.props.actions.setState}                      
              />
              <View style={styles.inputs}>
                <LoginForm
                    form={this.props.auth.form}
                    value={this.state.value}
                    onChange={self.onChange.bind(self)}
                />
                {passwordDisplay}
              </View>
              <FormButton
                  isDisabled={!this.props.auth.form.isValid || this.props.auth.form.isFetching}
                  onPress={onButtonPress.bind(self)}
                  buttonText={loginButtonText}/>
              <View >
                <View style={styles.forgotContainer}>
                  {leftMessage}
                  {rightMessage}
                </View>
              </View>
            </View>
          </View>
        );
      }//else
  }
}
