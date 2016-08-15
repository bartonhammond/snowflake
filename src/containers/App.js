/**
 * # app.js
 *  Display startup screen and 
 *  getSessionTokenAtStartup which will navigate upon completion 
 *
 *   
 *  
 */
'use strict';
/*
 * ## Imports
 *  
 * Imports from redux
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Immutable Map
 */
import {Map} from 'immutable';

/**
 * Project actions
 */
import * as authActions from '../reducers/auth/authActions';
import * as deviceActions from '../reducers/device/deviceActions';
import * as globalActions from '../reducers/global/globalActions';

/**
 * The components we need from ReactNative
 */
import React from 'react';
import
{ 	
  StyleSheet,
  View,
  Text
}
from 'react-native';

/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header';

/**
 * ## Actions
 * 3 of our actions will be available as ```actions```
 */
const actions = [
  authActions,
  deviceActions,
  globalActions
];

/**
 *  Save that state
 */
function mapStateToProps(state) {
  return {
      ...state
  };
};

/**
 * Bind all the functions from the ```actions``` and bind them with
 * ```dispatch```
 */
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


var styles = StyleSheet.create({
  container: {
    borderTopWidth: 2,
    borderBottomWidth:2,
    marginTop: 80,
    padding: 10
  },
  summary: {
    fontFamily: 'BodoniSvtyTwoITCTT-Book',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

/**
 * ## App class
 */
var reactMixin = require('react-mixin');
import TimerMixin from 'react-timer-mixin';
/**
 * ### Translations
 */
var I18n = require('react-native-i18n');
import Translations from '../lib/Translations';
I18n.translations = Translations;

let App = React.createClass({
  /**
   * See if there's a sessionToken from a previous login
   * 
   */
  componentDidMount() {
    //Use a timer so App screen is displayed 
    this.setTimeout(
      () => {
        this.props.actions.getSessionToken();
      },
      2500
    );

  },
  
  render() {
    return(
      <View style={ styles.container }>
	<Header isFetching={this.props.auth.form.isFetching}
                showState={this.props.global.showState}
                currentState={this.props.global.currentState}
                onGetState={this.props.actions.getState}
                onSetState={this.props.actions.setState}                      
	/>
        
	<Text style={ styles.summary }>Snowflake {I18n.t("App.version")}:  {this.props.device.version}</Text>
      </View>
    );
  }
});
// Since we're using ES6 classes, have to define the TimerMixin
reactMixin(App.prototype, TimerMixin);
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(App);

