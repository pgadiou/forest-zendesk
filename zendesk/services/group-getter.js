"use strict";

const axios = require('axios');
const AbstractGetter = require('./abstract-getter');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class GroupGetter extends AbstractGetter {

  perform () {
    return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/groups/${this.params.groupId}`, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
    })
    .then( (response) => {
      //console.log(response);
      return response.data.group;
    });
  };
}

module.exports = GroupGetter;
