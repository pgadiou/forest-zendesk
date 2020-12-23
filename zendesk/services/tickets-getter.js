"use strict";

var P = require('bluebird');
const axios = require('axios');

var logger = require('forest-express/dist/services/logger');

var dataUtil = require('forest-express/dist/utils/data');
const TicketGetter = require('./ticket-getter');

function TicketsGetter(Implementation, params, opts, integrationInfo) {
  var apiKey = opts.apiKey;
  var collectionModel = null;

  function hasPagination() {
    return params.page;
  }

  function getLimit() {
    if (hasPagination()) {
      return params.page.size || 10;
    }

    return 10;
  }

  function getStartingAfter() {
    if (hasPagination() && params.starting_after) {
      return params.starting_after;
    }

    return undefined;
  }

  function getEndingBefore() {
    if (hasPagination() && params.ending_before) {
      return params.ending_before;
    }

    return undefined;
  }

  function getTickets(query) {
    return new P(function (resolve, reject) {
      zendesk.tickets.list(query, function (err, tickets) {
        if (err) {
          return reject(err);
        }

        return resolve([tickets.total_count, tickets.data]);
      });
    });
  }

  this.perform = function () {
    collectionModel = integrationInfo.collection;
    var collectionFieldName = integrationInfo.field,
        embeddedPath = integrationInfo.embeddedPath;
    var fieldName = embeddedPath ? "".concat(collectionFieldName, ".").concat(embeddedPath) : collectionFieldName;

    return axios.get('https://forestadmin-sehelp.zendesk.com//api/v2/search.json', {
      auth: {
        username: 'sebastienp@forestadmin.com',
        password: 'urn3kfvSbY3w'
      },
      params: {
        query: 'type:ticket',
        per_page: params.page.size,
        page: params.page.number,
        sort_by: 'created_at',
        sort_order: 'asc',
        include: 'comment_count',
      }
    })
    .then( (response) => {
      let ticketsData = [];
      let count = response.data.count;
      console.log(response);
      return [count, response.data.results];
    });


    // return Implementation.Zendesk.getCustomer(collectionModel, collectionFieldName, params.recordId).then(function (customer) {
    //   var query = {
    //     limit: getLimit(),
    //     starting_after: getStartingAfter(),
    //     ending_before: getEndingBefore(),
    //     'include[]': 'total_count'
    //   };

    //   if (customer && !!customer[collectionFieldName]) {
    //     query.customer = dataUtil.find(customer[collectionFieldName], embeddedPath);
    //   }

    //   if (customer && !query.customer) {
    //     return P.resolve([0, []]);
    //   }

    //   return getTickets(query).spread(function (count, tickets) {
    //     return P.map(tickets, function (ticket) {
    //       if (customer) {
    //         ticket.customer = customer;
    //       } else {
    //         return Implementation.Zendesk.getCustomerByUserField(collectionModel, fieldName, ticket.customer).then(function (customerFound) {
    //           ticket.customer = customerFound;
    //           return ticket;
    //         });
    //       }

    //       return ticket;
    //     }).then(function (ticketsData) {
    //       return [count, ticketsData];
    //     });
    //   })["catch"](function (error) {
    //     logger.warn('Zendesk tickets retrieval issue: ', error);
    //     return P.resolve([0, []]);
    //   });
    // }, function () {
    //   return P.resolve([0, []]);
    // });
  };
}

module.exports = TicketsGetter;