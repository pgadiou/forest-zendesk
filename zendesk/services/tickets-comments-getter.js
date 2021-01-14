"use strict";

const axios = require('axios');
const AbstractRecordsGetter = require('./abstract-records-getter');
const _ = require('lodash');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;
const constants = require('../constants');

class TicketsCommentsGetter extends AbstractRecordsGetter {

  getRecords() {

    const parentId = this.params.parentRelationshipId;
    let url = `${ZENDESK_URL_PREFIX}/api/v2/tickets/${parentId}/comments.json?include_inline_images=true`;

    const {sort_by, sort_order} = this.getSort({
      default_sort_by: 'created_at',
      default_sort_order: 'desc',
      collection_name: constants.ZENDESK_TICKETS_COMMENTS,
    });

    return axios.get(url, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
      params: {
        include_inline_images: true,
        sort_by: sort_by,
        sort_order: sort_order,
      }
    })
    .then( async (response) => {
      let count = response.data.count;
      let records = response.data.comments;
      const authorIds = _.uniq(_.map(records, 'author_id'));
      let users = [];

      for (let userId of authorIds) {
        const user = await axios.get(`${ZENDESK_URL_PREFIX}/api/v2/users/${userId}.json`, {
          headers: {
            'Authorization': `Basic ${this.getToken()}` 
          },
        });
        users.push(user.data.user); 
      }
  
      for (let record of records){
        record.author = users.filter(user => user.id === record.author_id)[0];
        record.id = `${parentId}|${record.id}`;
        //record.direct_url = `${ZENDESK_URL_PREFIX}/agent/comments/${record.id}`;
      } 
    
      //console.log(response);
      return [count, records];
    })
    .catch(error => {
      console.log(error);

    })
  } 
}

module.exports = TicketsCommentsGetter;
