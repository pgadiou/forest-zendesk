"use strict";

var P = require('bluebird');
const axios = require('axios');

function TicketGetter(Implementation, params, opts, integrationInfo) {
  var zendesk = null; //TODO with a GET => opts.integrations.zendesk.zendesk(opts.integrations.zendesk.apiKey);
  var collectionModel = null;

  function getTicket(ticketId) {
    return new P(function (resolve, reject) {
      zendesk.tickets.retrieve(ticketId, function (error, ticket) {
        if (error) {
          return reject(error);
        }

        return resolve(ticket);
      });
    });
  }

  this.perform = function () {
    collectionModel = integrationInfo.collection;
    var collectionFieldName = integrationInfo.field,
        embeddedPath = integrationInfo.embeddedPath;
    var fieldName = embeddedPath ? "".concat(collectionFieldName, ".").concat(embeddedPath) : collectionFieldName;
    return axios.get(`https://forestadmin-sehelp.zendesk.com//api/v2/tickets/${params.ticketId}?include=comment_count`, {
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