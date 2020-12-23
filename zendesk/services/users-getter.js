"use strict";

const axios = require('axios');

function UsersGetter(Implementation, params, opts, integrationInfo) {
  var apiKey = opts.apiKey;

  this.perform = function () {

    return axios.get('https://forestadmin-sehelp.zendesk.com//api/v2/search.json', {
      auth: {
        username: 'sebastienp@forestadmin.com',
        password: 'urn3kfvSbY3w'
      },
      params: {
        query: 'type:user',
        per_page: params.page.size,
        page: params.page.number,
        sort_by: 'created_at',
        sort_order: 'asc',
      }
    })
    .then( (response) => {
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

module.exports = UsersGetter;