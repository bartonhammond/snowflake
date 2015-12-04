'use string';
import store from 'react-native-simple-store';
import CONFIG from './config';

export default class AppAuthToken {
  constructor () {
    this.SESSION_TOKEN_KEY = CONFIG.PARSE.SESSION_TOKEN_KEY;
  }
  
  storeSessionToken(sessionToken) {
    try {
      return store.save(this.SESSION_TOKEN_KEY,{
        sessionToken: sessionToken
      });
    } catch (error) {
      throw error;
    }
  }
      
  getSessionToken() {
    return store.get(this.SESSION_TOKEN_KEY);
  }

  deleteSessionToken() {
    return store.delete(this.SESSION_TOKEN_KEY);
  }
}

