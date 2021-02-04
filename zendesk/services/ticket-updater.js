"use strict";
/* eslint-disable no-undef */

const axios = require('axios');
const AbstractGetter = require('./abstract-getter');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class TicketUpdater extends AbstractGetter {
  update (values) {
    const ticketId = this.params.data.attributes.ids[0];
    const body = {
      ticket: values
    };
    return axios.put(`${ZENDESK_URL_PREFIX}/api/v2/tickets/${ticketId}`, 
      body,
      {
        headers: {
          'Authorization': `Basic ${this.getToken()}` 
        },
      }
    )
    .then( (response) => {
      //console.log(response);
      return response.data.ticket;
    });
  }
}

module.exports = TicketUpdater;
