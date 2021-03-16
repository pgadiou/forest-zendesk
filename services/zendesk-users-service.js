/* eslint-disable no-undef */
"use strict";
const { RecordSerializer } = require('forest-express-sequelize');

const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

const {getFilterConditons, getSort, getToken} = require('./forest-smart-collection-helpers');

async function getUsers(request, response, next) {

  let filterConditions = getFilterConditons(request.query);

  // Transform the sorting to Zendesk Format
  const {sort_by, sort_order} = getSort(request.query, {
    default_sort_by: 'created_at',
    default_sort_order: 'desc',
    collection_name: 'zendesk_users',
  });
  
  // Call the Zendesk API using the search endpoint
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/search.json`, {
    headers: {
      // Get the Zendesk Authentication Token
      'Authorization': `Basic ${getToken()}` 
    },
    params: {
      // Add the filter conditions transformed
      query: `type:user ${filterConditions.join(' ')}`,
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
    let records = resp.data.results;
    // Serialize the result using the Forest Admin format
    const recordsSerializer = new RecordSerializer({ name: 'zendesk_users' });
    const recordsSerialized = await recordsSerializer.serialize(records);
    response.send({ ...recordsSerialized, meta:{ count: count }});      
  })
  .catch(next);
} 

async function getUser(request, response, next) {
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/users/${request.params.userId}`, {
    headers: {
      'Authorization': `Basic ${getToken()}` 
    },
  })
  .then( async (resp) => {
    let record = resp.data.user;
    // Serialize the result using the Forest Admin format
    const recordSerializer = new RecordSerializer({ name: 'zendesk_users' });
    const recordSerialized = await recordSerializer.serialize(record);
    response.send(recordSerialized);      
  })
  .catch(next);  
  
}

module.exports = {
  getUsers,
  getUser
};