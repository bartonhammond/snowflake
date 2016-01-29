/**
 * # Login.js
 * 
 * This class is a little complicated as it handles 4 states. It's also
 * a container so there is boilerplate from Redux similiar to ```App```.
 */
'use strict';
/**
 * ## Imports
 * 
 * Redux 
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions';
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable
 */ 
import {Map} from 'immutable';

/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header';
/**
 * The ErrorAlert displays an alert for both ios & android
 */
import ErrorAlert from '../components/ErrorAlert';
/**
 * The FormButton will change it's text between the 4 states as necessary
 */
import FormButton from '../components/FormButton';
/**
 *  The LoginForm does the heavy lifting of displaying the fields for
 * textinput and displays the error messages
 */
import LoginForm from '../components/LoginForm';
/**
 * The itemCheckbox will toggle the display of the password fields 
 */
import ItemCheckbox from '../components/ItemCheckbox';

/**
 * The necessary React components
 */
import React,
{
  Component,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
}
from 'react-native';

/**
 * The 4 states were interested in
 */
const {
  LOGIN_STATE_LOGOUT,
  LOGIN_STATE_REGISTER,
  LOGIN_STATE_LOGIN,
  LOGIN_STATE_FORGOT_PASSWORD
} = require('../lib/constants').default;
/**
 * ## Styles
 */
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
/**
 * ## Redux boilerplate
 */
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

class Login extends Component {
  /**
   * ## Login class 
   * Provide 4 user interfaces depending on state
   * In the constructor we set the initial state of the fields
   * displayed in the form to the properties.  This was mostly
   * necessary for Hot Loading
   */
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
  /**
   * ### componentWillReceiveProps
   * As the properties are validated they will be set here.
   */
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
  /**
   * ### onChange
   *
   * As the user enters keys, this is called for each key stroke.
   * Rather then publish the rules for each of the fields, I find it
   * better to display the rules required as long as the field doesn't
   * meet the requirements.
   * *Note* that the fields are validated by the authReducer
   */
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
  /**
   * ### render
   * Setup some default presentations and render 
   */
  render() {
    this.errorAlert.checkError(this.props.auth.form.error);
     
    /**
    * Set default components for reference later
    */
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

    /**
    * Toggle the display of the Password and PasswordAgain fields
    */
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

    /**
     * Display the appropriate fields depending on the state
     */
    switch(this.props.auth.form.state) {
      /**
       * The logout state is rather simple - no input fields
       */
    case(LOGIN_STATE_LOGOUT):
      loginButtonText = 'Log out';
      onButtonPress = () => {
        this.props.actions.logout();
      };
      break;

      /**
       * Configure the screen for registration and call the signup
      action 
       */
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

      /**
       * Configure the screen for logging in and call the login action
       */
    case(LOGIN_STATE_LOGIN):
      loginButtonText = 'Log in';
      leftMessage = register;
      rightMessage = forgotPassword;
      onButtonPress = () => {
        this.props.actions.login(this.props.auth.form.fields.username, this.props.auth.form.fields.password);
      };
      passwordDisplay = itemCheckBox;
      break;

      /**
       * Configure the screen for password reset and call the
       * resetPassword action
       */
    case(LOGIN_STATE_FORGOT_PASSWORD):
      loginButtonText = 'Reset password';
      leftMessage = register;
      rightMessage = alreadyHaveAccount;
      onButtonPress = () => {
        this.props.actions.resetPassword(this.props.auth.form.fields.email);
      };
      break;
    }//switch

    /**
     * If we're logged in, display the logout button.  
     * The header will display the spinner if we're fetching
     * We'll look at these properties for Header there
     */
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
      /**
       * The LoginForm is now defined with the required fields.  Just
       * surround it with the Header and the navigation messages
       * Note how the button too is disabled if we're fetching. The 
       * header props are mostly for support of Hot reloading. 
       * See the docs for Header for more info.
       */
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
export default connect(mapStateToProps, mapDispatchToProps)(Login);
