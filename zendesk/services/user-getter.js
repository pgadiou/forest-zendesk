"use strict";

const axios = require('axios');
const AbstractGetter = require('./abstract-getter');

class UserGetter extends AbstractGetter {

  perform () {
    return axios.get(`https://forestadmin-sehelp.zendesk.com/api/v2/users/${this.params.userId}.json`, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
    
    })
    .then( (response) => {
      console.log(response);
      return response.data.user;
    });
  };
}

module.exports = UserGetter;
