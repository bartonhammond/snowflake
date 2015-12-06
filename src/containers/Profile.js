'use strict';
/**
 *  Thanks to: http://browniefed.com/blog/2015/06/07/react-native-layout-examples/
 *
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import * as profileActions from '../reducers/profile/profileActions';
import * as globalActions from '../reducers/global/globalActions';
import {Map} from 'immutable';
import ErrorAlert from '../components/ErrorAlert';
import FormButton from '../components/FormButton';
import Header from '../components/Header';
import React,
{
  Component,
  StyleSheet,
  View
}
from 'react-native';

import ItemCheckbox from '../components/ItemCheckbox';

import t from 'tcomb-form-native';

let Form = t.form.Form;

import {
} from '../lib/constants';


var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'transparent'
  },
  inputs: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  }
});

const actions = [
  profileActions,
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
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state = {
      formValues: {
        username: '',
        email: ''
      }
    };
  }
  onChange(value) {
    this.props.actions.onProfileFormFieldChange(value);
    this.setState({value});
  }

  componentWillReceiveProps(props) {
    this.setState({
      formValues: {
        username: props.profile.form.fields.username,
        email: props.profile.form.fields.email
      }
    });

  }
  componentDidMount() {
    if (this.props.profile.form.fields.username == '' && this.props.profile.form.fields.email == '') {
      this.props.actions.getProfile(this.props.global.currentUser);
    } else {
      this.setState({
        formValues: {
          username: this.props.profile.form.fields.username,
          email: this.props.profile.form.fields.email
        }
      });
    }      
  }

  render() {
    this.errorAlert.checkError(this.props.profile.form.error);

    let self = this;
    
    let ProfileForm = t.struct({
      username: t.String,
      email: t.String
    });
    
    let options = {
      auto: 'placeholders',
      fields: {
        username: {
          label: 'Username',
          maxLength: 12,
          editable: !this.props.profile.form.isFetching,
          hasError: this.props.profile.form.fields.usernameHasError,
          error: 'Must have 6-12 characters and/or numbers'
        },
        email: {
          label: 'Email',
          keyboardType: 'email-address',
          editable: !this.props.profile.form.isFetching,
          hasError: this.props.profile.form.fields.emailHasError,
          error: 'Please enter valid email'
        }
      }
    };

    
    let profileButtonText = 'Update Profile';
    let onButtonPress = () => {
      this.props.actions.updateProfile(
        this.props.profile.form.originalProfile.objectId,
        this.props.profile.form.fields.username,
        this.props.profile.form.fields.email,
        this.props.global.currentUser);
    };

    return (
      <View style={styles.container}>
        <Header isFetching={this.props.profile.form.isFetching}
                showState={this.props.global.showState}
                currentState={this.props.global.currentState}
                onGetState={this.props.actions.getState}
                onSetState={this.props.actions.setState}
        />
        <View style={styles.inputs}>
          <Form
              ref="form"
              type={ProfileForm}
              options={options}
              value={this.state.formValues}
              onChange={this.onChange.bind(self)}
          />
          <ItemCheckbox text="Email verified (display only)"
                        disabled={true}
                        checked={this.props.profile.form.fields.emailVerified}
          />
        </View>

        <FormButton
            isDisabled={!this.props.profile.form.isValid || this.props.profile.form.isFetching}
            onPress={onButtonPress.bind(self)}
            buttonText={profileButtonText}/>


      </View>
    );
  }
}
