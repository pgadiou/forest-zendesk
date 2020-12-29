"use strict";

const axios = require('axios');
const AbstractRecordsGetter = require('./abstract-records-getter');

class TicketsGetter extends AbstractRecordsGetter {

  getRecords() {
    return axios.get('https://forestadmin-sehelp.zendesk.com/api/v2/search.json', {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
      params: {
        query: 'type:ticket',
        per_page: this.params.page.size,
        page: this.params.page.number,
        sort_by: 'created_at',
        sort_order: 'asc',
        include: 'comment_count',
      }
    })
  } 
}

module.exports = TicketsGetter;
