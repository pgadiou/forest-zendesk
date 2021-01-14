"use strict";

const axios = require('axios');
const AbstractRecordsGetter = require('./abstract-records-getter');
const _ = require('lodash');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;
const constants = require('../constants');

class UsersGetter extends AbstractRecordsGetter {

  getRecords() {
    let filterConditions = this.getFilterConditons({
      replaceFieldNames: {'type':'ticket_type'}
    });

    const {sort_by, sort_order} = this.getSort({
      default_sort_by: 'created_at',
      default_sort_order: 'desc',
      collection_name: constants.ZENDESK_USERS,
    });

    return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/search.json`, {
      headers: {
        'Authorization': `Basic ${this.getToken()}` 
      },
      params: {
        query: `type:user ${filterConditions.join(' ')}`,
        per_page: this.params.page.size,
        page: this.params.page.number,
        sort_by: sort_by,
        sort_order: sort_order,
      }
    })
    .then( async (response) => {
      let count = response.data.count;
      let records = response.data.results;
      const groupIds = _.uniq(_.map(records, 'default_group_id'));
      let groups = [];

      for (let id of groupIds) {
        if (!id) continue;
        const result = await axios.get(`${ZENDESK_URL_PREFIX}/api/v2/groups/${id}`, {
          headers: {
            'Authorization': `Basic ${this.getToken()}` 
          },
        });
        groups.push(result.data.group); 
      }
  
      const organizationIds = _.uniq(_.map(records, 'organization_id'));
      let organizations = [];

      for (let id of organizationIds) {
        if (!id) continue;
        const result = await axios.get(`${ZENDESK_URL_PREFIX}/api/v2/organizations/${id}`, {
          headers: {
            'Authorization': `Basic ${this.getToken()}` 
          },
        });
        organizations.push(result.data.organization); 
      }

      for (let record of records){
        record.default_group = groups.filter(group => group.id === record.default_group_id)[0];
        record.default_organization = organizations.filter(organization => organization.id === record.organization_id)[0];
        record.direct_url = `${ZENDESK_URL_PREFIX}/agent/users/${record.id}`;
      } 

      //console.log(response);
      return [count, records];
    })
    .catch(error => {
      console.log(error);
    });
  } 
}

module.exports = UsersGetter;
