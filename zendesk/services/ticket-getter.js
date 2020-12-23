"use strict";

const axios = require('axios');

function TicketGetter(Implementation, params, opts, integrationInfo) {

  this.perform = function () {
    return axios.get(`https://forestadmin-sehelp.zendesk.com/api/v2/tickets/${params.ticketId}?include=comment_count`, {
      auth: {
        username: 'sebastienp@forestadmin.com',
        password: 'urn3kfvSbY3w'
      },
    })
    .then( (response) => {
      console.log(response);
      return response.data.ticket;
    });

  };
}

module.exports = TicketGetter;