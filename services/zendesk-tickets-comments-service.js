/* eslint-disable no-undef */
"use strict";
const { RecordSerializer } = require('forest-express-sequelize');

const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

const {getSort, getToken} = require('./forest-smart-collection-helpers');

async function getTicketsComments(request, response, next, ticketId) {

  let url = `${ZENDESK_URL_PREFIX}/api/v2/tickets/${ticketId}/comments.json?include_inline_images=true`;

  // Transform the sorting to Zendesk Format
  const {sort_by, sort_order} = getSort(request.query, {
    default_sort_by: 'created_at',
    default_sort_order: 'desc',
    collection_name: 'zendesk_tickets_comments',
  });
  
  // Call the Zendesk API using the search endpoint
  return axios.get(url, {
    headers: {
      // Get the Zendesk Authentication Token
      'Authorization': `Basic ${getToken()}` 
    },
    params: {
      include_inline_images: true,
      // Add the sort and sort order transformed
      sort_by: sort_by,
      sort_order: sort_order,
    }
  })
  .then( async (resp) => {
    let count = resp.data.count;
    let records = resp.data.comments;
    // Serialize the result using the Forest Admin format
    const recordsSerializer = new RecordSerializer({ name: 'zendesk_tickets_comments' });
    const recordsSerialized = await recordsSerializer.serialize(records);
    response.send({ ...recordsSerialized, meta:{ count: count }});      
  })
  .catch(next);
} 

module.exports = {
  getTicketsComments,
};