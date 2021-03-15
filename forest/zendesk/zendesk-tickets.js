/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');

const axios = require('axios');
const {getToken} = require('../../services/helpers');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

// Search on tickets => https://support.zendesk.com/hc/en-us/articles/203663206-Searching-tickets
collection('zendesk_tickets', {
  actions: [{
    name: 'Change Priority',
    type: 'single',
    endpoint: '/forest/actions/zendesk-ticket-change-priority',
    fields: [
      {
        field: 'New Ticket Priority',
        description: 'What is the new priority?',
        type: 'Enum',
        enums: ['urgent', 'high', 'normal', 'low'],
        isRequired: true
      },
    ],
  }],
  fields: [{
    field: 'id',
    type: 'Number',
    isFilterable: true,
  }, {
    field: 'created_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'updated_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'type',
    type: 'Enum',
    enums: ['problem', 'incident', 'question', 'task'],
    isFilterable: true,
    isSortable: true,
  }, {
    field: 'priority',
    type: 'Enum',
    enums: ['urgent', 'high', 'normal', 'low'],
    isFilterable: true,
    isSortable: true,
  }, {
    field: 'status',
    type: 'Enum',
    enums: ['new', 'open', 'pending', 'hold', 'solved', 'closed'],
    isFilterable: true,
    isSortable: true,
  }, {
    field: 'subject',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'description',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'comment_count',
    type: 'Number',
  }, {
    field: 'requester',
    type: 'String',
    reference: 'zendesk_users.id',
    get: (ticket) => {
      return getZendeskUserById(ticket.requester_id);
    }    
  }, {
    field: 'submitter',
    type: 'String',
    reference: 'zendesk_users.id',
    get: (ticket) => {
      return getZendeskUserById(ticket.requester_id);
    }
  }, {
    field: 'assignee',
    type: 'String',
    reference: 'zendesk_users.id',
    get: (ticket) => {
      return getZendeskUserById(ticket.requester_id);
    }
  }, {
    field: 'direct_url',
    type: 'String',
    get: (ticket) => {
      return `${ZENDESK_URL_PREFIX}/agent/tickets/${ticket.id}`;
    },    
  }, {
    field: 'is_public',
    type: 'Boolean',
  }, {
    field: 'satisfaction_rating',
    type: 'Json',
  }, {
    field: 'tags',
    type: ['String'],
    isFilterable: true, // not => filtering on array is not yet possible
  }, ],
  segments: [],
});

function getZendeskUserById(userId) {
  if(!userId) return null;
  return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/users/${userId}`, {
    headers: {
      'Authorization': `Basic ${getToken()}` 
    },
  })
  .then( async (resp) => {
    const user = resp.data.user;
    return user;
  });
}