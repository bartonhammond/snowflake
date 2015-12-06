'use strict';

import React, { AppRegistry } from 'react-native';
import { Provider } from 'react-redux/native';
import App from './containers/App';
import configureStore from './lib/configureStore';
import {setPlatform, setVersion} from './reducers/device/deviceActions';
import {setStore} from './reducers/global/globalActions';


import authInitialState from './reducers/auth/authInitialState';
import deviceInitialState from './reducers/device/deviceInitialState';
import globalInitialState from './reducers/global/globalInitialState';
import profileInitialState from './reducers/profile/profileInitialState';

var VERSION='0.0.1';


function getInitialState() {
    const _initState = {
    auth: new authInitialState,
    device: (new deviceInitialState).set('isMobile',true).set('version',VERSION),
    global: (new globalInitialState),
    profile: new profileInitialState
  };
  return _initState;
}

export default function native(platform) {

  let Snowflake = React.createClass( {
    render() {
      const store = configureStore(getInitialState());
      store.dispatch(setPlatform(platform));
      store.dispatch(setVersion(VERSION));
      store.dispatch(setStore(store));

      return (
          <Provider store={store}>
            {() => <App store={store}/>}
          </Provider>
      );

    }
  });

  AppRegistry.registerComponent('snowflake', () => Snowflake);
}
