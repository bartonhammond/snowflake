'use strict';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux/native';
import Login from './Login';
import Tabbar from '../components/Tabbar';
import * as authActions from '../reducers/auth/authActions';
import * as deviceActions from '../reducers/device/deviceActions';
import * as globalActions from '../reducers/global/globalActions';
import {Map} from 'immutable';
import Subscribable from 'Subscribable';

import React,
{ 

}
from 'react-native';
import {
  LOGIN_STATE_LOGOUT
} from '../lib/constants';


const actions = [
  authActions,
  deviceActions,
  globalActions
];

function mapStateToProps(state) {
  return {
      ...state
  };
};

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

let App = React.createClass({
  mixins: [Subscribable.Mixin],
  getInitialState() {
    return {
      loggedIn: false
    };
  },

  componentWillReceiveProps(props) {
    var loggedIn =  props.auth.form.state === LOGIN_STATE_LOGOUT;
    this.setState({
      loggedIn: loggedIn
    });
  },

  componentDidMount() {
    this.props.actions.getSessionToken();
  },
  
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

export default connect(mapStateToProps, mapDispatchToProps)(App);

