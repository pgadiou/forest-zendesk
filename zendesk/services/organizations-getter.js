"use strict";
/* eslint-disable no-undef */

const axios = require('axios');
const AbstractRecordsGetter = require('./abstract-records-getter');

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
    
      //console.log(response);
      return [count, records];
    })
    .catch(error => {
      console.log(error);

    })
  } 
}

module.exports = OrganizationsGetter;
