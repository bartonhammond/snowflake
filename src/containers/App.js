/**
 * # app.js
 *  **Note** a lot of this is boilerplate which is also in Login &
 *  Profile
*
 *  After setting up the Redux actions, props and dispatch, this
 * class ```renders``` either the ```Login``` or ```Tabbar```
 */
'use strict';
/*
 * ## Imports
 *  
 * Imports from redux
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';

/**
 * Immutable Map
 */
import {Map} from 'immutable';

/**
 * Project imports
 */
import Login from './Login';
import Tabbar from '../components/Tabbar';

/**
 * Project actions
 */
import * as authActions from '../reducers/auth/authActions';
import * as deviceActions from '../reducers/device/deviceActions';
import * as globalActions from '../reducers/global/globalActions';

/**
 * We only need React
 */
import React,
{ 

}
from 'react-native';

/**
 * We only have one state to worry about
 */

import {
  LOGIN_STATE_LOGOUT
} from '../lib/constants';

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

/*
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
/**
 * ## App class
 */
let App = React.createClass({
  /**
   * The initial state will be logged out
   */
  getInitialState() {
    return {
      loggedIn: false
    };
  },
  /**
   * Change the state to logged in if the Auth form is in the state of
   * ```LOGIN_STATE_LOGOUT```.  This  state will be set after a
   * successful Registrations or Login
   */
  componentWillReceiveProps(props) {
    var loggedIn =  props.auth.form.state === LOGIN_STATE_LOGOUT;
    this.setState({
      loggedIn: loggedIn
    });
  },
  /**
   * See if there's a sessionToken from a previous login, if so, then
   * the state will be changed to ```LOGIN_STATE_LOGOUT```
   */
  componentDidMount() {
    this.props.actions.getSessionToken();
  },
  /**
   * Display the ```Tabbar``` if we're logged in
   */
  render () {
    let component = <Login/>;
    if (this.state.loggedIn) {
      component = <Tabbar/>;
    }
    return (
      component
    );
  }
});
/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(App);

