"use strict";

const axios = require('axios');
const AbstractRecordsGetter = require('./abstract-records-getter');
const _ = require('lodash');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class UsersGetter extends AbstractRecordsGetter {

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
        query: `type:user ${requesterQuery}`,
        per_page: this.params.page.size,
        page: this.params.page.number,
        sort_by: 'created_at',
        sort_order: 'asc',
      }
    })
    .then( async (response) => {
      let count = response.data.count;
      let records = response.data.results;
  
      for (let record of records){
        record.direct_url = `${ZENDESK_URL_PREFIX}/agent/users/${record.id}`;
      } 
      //console.log(response);
      return [count, records];
    });
  } 
}

module.exports = UsersGetter;
