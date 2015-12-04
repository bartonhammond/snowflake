import auth from './auth/authReducer';
import device from './device/deviceReducer';
import global from './global/globalReducer';
import profile from './profile/profileReducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth,
  device,
  global,
  profile
});

export default rootReducer;
