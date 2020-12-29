"use strict";

const axios = require('axios');
const AbstractGetter = require('./abstract-getter');

class UsersGetter extends AbstractGetter {

  perform () {
    return axios.get('https://forestadmin-sehelp.zendesk.com//api/v2/search.json', {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
      params: {
        query: 'type:user',
        per_page: this.params.page.size,
        page: this.params.page.number,
        sort_by: 'created_at',
        sort_order: 'asc',
      }
    })
    .then( (response) => {
      let count = response.data.count;
      console.log(response);
      return [count, response.data.results];
    });
  };
}

module.exports = UsersGetter;
