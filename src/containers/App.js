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
  LOGGED_IN,
  LOGGED_OUT
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
  
  onLogin() {
    this.setState({
      loggedIn: true
    });
  },
  
  onLogout() {
    this.setState({
      loggedIn: false
    });
  },
  
  componentDidMount() {
    this.props.actions.getSessionToken();
    this.addListenerOn(this.props.global.eventEmitter, LOGGED_IN, this.onLogin);
    this.addListenerOn(this.props.global.eventEmitter, LOGGED_OUT, this.onLogout);
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

