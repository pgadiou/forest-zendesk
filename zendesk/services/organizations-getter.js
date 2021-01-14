"use strict";

const axios = require('axios');
const AbstractRecordsGetter = require('./abstract-records-getter');
const _ = require('lodash');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;
const constants = require('../constants');

class OrganizationsGetter extends AbstractRecordsGetter {

  getRecords() {

    let url = `${ZENDESK_URL_PREFIX}/api/v2/organizations`;
    if (this.params.parentRelationshipId) {
      url = `${ZENDESK_URL_PREFIX}/api/v2/users/${this.params.parentRelationshipId}/organizations`;
    }

    const {sort_by, sort_order} = this.getSort({
      default_sort_by: 'created_at',
      default_sort_order: 'desc',
      collection_name: constants.ZENDESK_ORGANIZATIONS,
    });

    return axios.get(url, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
      params: {
        per_page: this.params.page.size,
        page: this.params.page.number,
        sort_by: sort_by,
        sort_order: sort_order,
      }
    })
    .then( async (response) => {
      let count = response.data.count;
      let records = response.data.organizations;
      // const userIds = _.uniq(_.concat(_.map(records, 'requester_id'), _.map(records, 'assignee_id'), _.map(records, 'submitter_id')));
      // let users = [];

      // for (let userId of userIds) {
      //   const user = await axios.get(`${ZENDESK_URL_PREFIX}/api/v2/users/${userId}.json`, {
      //     headers: {
      //       'Authorization': `Basic ${this.getToken()}` 
      //     },
      //   });
      //   users.push(user.data.user); 
      // }
  
      for (let record of records){
        // record.requester = users.filter(user => user.id === record.requester_id)[0];
        // record.submitter = users.filter(user => user.id === record.submitter_id)[0];
        // record.assignee = users.filter(user => user.id === record.assignee_id)[0];
        //record.direct_url = `${ZENDESK_URL_PREFIX}/agent/organizations/${record.id}`;
      } 
    
      //console.log(response);
      return [count, records];
    })
    .catch(error => {
      console.log(error);

    })
  } 
}

module.exports = OrganizationsGetter;
