/* eslint-disable no-undef */
"use strict";
const { RecordSerializer } = require('forest-express-sequelize');

const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

const {getSort, getToken} = require('./forest-smart-collection-helpers');

async function getOrganizations(request, response, next) {

  // Transform the sorting to Zendesk Format
  const {sort_by, sort_order} = getSort(request.query, {
    default_sort_by: 'created_at',
    default_sort_order: 'desc',
    collection_name: 'zendesk_organizations',
  });
  
  // Call the Zendesk API using the search endpoint
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/organizations`, {
    headers: {
      // Get the Zendesk Authentication Token
      'Authorization': `Basic ${getToken()}` 
    },
    params: {

      // Add the pagination parameters
      per_page: request.query.page.size,
      page: request.query.page.number,
      // Add the sort and sort order transformed
      sort_by: sort_by,
      sort_order: sort_order,
    }
  })
  .then( async (resp) => {
    let count = resp.data.count;
    let records = resp.data.organizations;
    // Serialize the result using the Forest Admin format
    const recordsSerializer = new RecordSerializer({ name: 'zendesk_organizations' });
    const recordsSerialized = await recordsSerializer.serialize(records);
    response.send({ ...recordsSerialized, meta:{ count: count }});      
  })
  .catch(next);
} 

async function getOrganization(request, response, next) {
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/organizations/${request.params.organizationId}`, {
    headers: {
      'Authorization': `Basic ${getToken()}` 
    },
  })
  .then( async (resp) => {
    let record = resp.data.organization;
    // Serialize the result using the Forest Admin format
    const recordSerializer = new RecordSerializer({ name: 'zendesk_organizations' });
    const recordSerialized = await recordSerializer.serialize(record);
    response.send(recordSerialized);      
  })
  .catch(next);  
}

function getZendeskOrganizationById(organizationId) {
  if(!organizationId) return null;
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/organizations/${organizationId}`, {
    headers: {
      'Authorization': `Basic ${getToken()}` 
    },
  })
  .then( async (resp) => {
    return resp.data.organization;
  });
}

module.exports = {
  getOrganizations,
  getOrganization,
  getZendeskOrganizationById
};