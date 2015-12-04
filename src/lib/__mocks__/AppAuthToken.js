'use strict';
require('regenerator/runtime');
export default class AppAuthToken {
  async getSessionToken () {
    return await {
      sessionToken: {
        sessionToken: 'token'
      }
    };
  }

  async storeSessionToken() {
    return await {};
  }
  
  async deleteSessionToken () {
    return await {};
  }
};


