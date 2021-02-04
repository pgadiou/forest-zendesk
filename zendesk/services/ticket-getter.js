"use strict";
/* eslint-disable no-undef */

const axios = require('axios');
const AbstractGetter = require('./abstract-getter');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class TicketGetter extends AbstractGetter {

  perform () {
    return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/tickets/${this.params.ticketId}?include=comment_count`, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
    })
    .then( (response) => {
      //console.log(response);
      return response.data.ticket;
    });
  }
}

module.exports = TicketGetter;
