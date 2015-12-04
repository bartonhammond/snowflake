/**
 * 
 * 
 */
'use strict';

import React, { Component, AppRegistry } from 'react-native';
import { Provider } from 'react-redux/native';
import App from './containers/App';
import configureStore from './lib/configureStore';
import {setPlatform, setVersion} from './reducers/device/deviceActions';
import EventEmitter from 'EventEmitter';

var VERSION='0.0.1';

export default function native(platform) {
  const initialState = {
    device: {
      isMobile: true,
      version: VERSION
    },
    global: {
      sessionToken: null,
      eventEmitter: new EventEmitter(),
      currentUser: null
    }
  };
  
  const store = configureStore(initialState);

  store.dispatch(setPlatform(platform));
  store.dispatch(setVersion(VERSION));
  
  class Snowflake  extends Component {
    render() {
      return (
          <Provider store={store}>
          {() => <App store={store}/>}
            </Provider>
      );

    }
  }

  AppRegistry.registerComponent('snowflake', () => Snowflake);
}
