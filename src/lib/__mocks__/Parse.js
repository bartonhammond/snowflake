'use strict';
require('regenerator/runtime');

export default class Parse  {
  constructor(){
    var _bodyInit = JSON.stringify({
      code: 200
    });
    this.response = {
      "status": 201
    };
    this.response._bodyInit = _bodyInit;  
  }
  
  async logout () {
    return await this.response;

  }

  async login() {
    return await this.response;
  }

  async signup() {
    return await this.response;
  }

  async resetPassword() {
    return await this.response;
  }

  async getProfile() {
    return await this.response;
  }

  async updateProfile() {
    return await this.response;
  }

}

