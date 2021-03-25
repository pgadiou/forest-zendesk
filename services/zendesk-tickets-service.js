/* eslint-disable no-undef */
"use strict";
const { RecordSerializer } = require('forest-express-sequelize');

const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

const {getFilterConditions, getSort, getToken} = require('./forest-smart-collection-helpers');

async function getTickets(request, response, next, additionalFilter) {

  let filterConditions = getFilterConditions(request.query, {
    // Zendesk API requires to search on field ticket_type for the ticket type
    replaceFieldNames: {'type':'ticket_type'}
  });
  if (additionalFilter) filterConditions.push(additionalFilter);

  // Transform the sorting to Zendesk Format
  const {sort_by, sort_order} = getSort(request.query, {
    default_sort_by: 'created_at',
    default_sort_order: 'desc',
    collection_name: 'zendesk_tickets',
  });
  
  // Call the Zendesk API using the search endpoint
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/search.json`, {
    headers: {
      // Get the Zendesk Authentication Token
      'Authorization': `Basic ${getToken()}` 
    },
    params: {
      // Add the filter conditions transformed
      query: `type:ticket ${filterConditions.join(' ')}`,
      // Add the pagination parameters
      per_page: request.query.page.size,
      page: request.query.page.number,
      // Add the sort and sort order transformed
      sort_by: sort_by,
      sort_order: sort_order,
      // Include the ticket comments count in the query response
      include: 'comment_count',
    }
  })
  .then( async (resp) => {
    let count = resp.data.count;
    let records = resp.data.results;
    // Serialize the result using the Forest Admin format
    const recordsSerializer = new RecordSerializer({ name: 'zendesk_tickets' });
    const recordsSerialized = await recordsSerializer.serialize(records);
    response.send({ ...recordsSerialized, meta:{ count: count }});      
  })
  .catch(next);
} 

async function getTicket(request, response, next) {
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/tickets/${request.params.ticketId}?include=comment_count`, {
    headers: {
      'Authorization': `Basic ${getToken()}` 
    },
  })
  .then( async (resp) => {
    let record = resp.data.ticket;
    // Serialize the result using the Forest Admin format
    const recordSerializer = new RecordSerializer({ name: 'zendesk_tickets' });
    const recordSerialized = await recordSerializer.serialize(record);
    response.send(recordSerialized);      
  })
  .catch(next);  
  
}

async function udpateTicket(ticketId, newValues) {
  const body = {
    ticket: newValues
  };
  return axios.put(`${ZENDESK_URL_PREFIX}/api/v2/tickets/${ticketId}`, 
    body,
    {
      headers: {
        'Authorization': `Basic ${getToken()}` 
      },
    }
  )
  .then( async (resp) => {
    let record = resp.data.ticket;
    return record;
  })
}

module.exports = {
  getTickets,
  getTicket,
  udpateTicket
};
