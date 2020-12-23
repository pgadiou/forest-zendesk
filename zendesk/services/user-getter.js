"use strict";

const axios = require('axios');

function UserGetter(Implementation, params, opts, integrationInfo) {

  this.perform = function () {
    return axios.get(`https://forestadmin-sehelp.zendesk.com/api/v2/users/${params.userId}.json`, {
      auth: {
        username: 'sebastienp@forestadmin.com',
        password: 'urn3kfvSbY3w'
      },
    })
    .then( (response) => {
      console.log(response);
      return response.data.user;
    });

  };
}

module.exports = UserGetter;