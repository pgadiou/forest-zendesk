"use strict";

const axios = require('axios');
const AbstractRecordsGetter = require('./abstract-records-getter');
const _ = require('lodash');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class TicketsGetter extends AbstractRecordsGetter {

  getRecords(filterPerCustomer, customer) {
    let requesterQuery = '';
    if (filterPerCustomer) {
      requesterQuery = `requester:${customer.email}`
    }
    return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/search.json`, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
      params: {
        query: `type:ticket ${requesterQuery}`,
        per_page: this.params.page.size,
        page: this.params.page.number,
        sort_by: 'created_at',
        sort_order: 'asc',
        include: 'comment_count',
      }
    })
    .then( async (response) => {
      let count = response.data.count;
      let records = response.data.results;
      const userIds = _.uniq(_.concat(_.map(records, 'requester_id'), _.map(records, 'assignee_id'), _.map(records, 'submitter_id')));
      let users = [];

      for (let userId of userIds) {
        const user = await axios.get(`${ZENDESK_URL_PREFIX}/api/v2/users/${userId}.json`, {
          headers: {
            'Authorization': `Basic ${this.getToken()}` 
          },
        });
        users.push(user.data.user); 
      }
  
      for (let record of records){
        record.requester = users.filter(user => user.id === record.requester_id)[0];
        record.submitter = users.filter(user => user.id === record.submitter_id)[0];
        record.assignee = users.filter(user => user.id === record.assignee_id)[0];
        record.direct_url = `${ZENDESK_URL_PREFIX}/agent/tickets/${record.id}`;
      } 
    
      //console.log(response);
      return [count, records];
    });
  } 
}

module.exports = TicketsGetter;
