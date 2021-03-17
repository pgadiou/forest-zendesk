/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');
const {getZendeskUserById} = require('../services/zendesk-users-service');

collection('zendesk_tickets_comments', {
  onlyForRelationships: true,
  actions: [],
  fields: [{
    field: 'id',
    type: 'Number',
  }, {
    field: 'created_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'type',
    type: 'String',
  }, {
    field: 'body',
    type: 'String',
  }, {
    field: 'html_body',
    type: 'String',
  }, {
    field: 'plain_body',
    type: 'String',
  }, {
    field: 'public',
    type: 'Boolean',
  }, {
    field: 'attachments',
    type: ['Json'],
  }, {
    field: 'author',
    type: 'String',
    reference: 'zendesk_users.id',
    get: (ticket_comment) => {
      return getZendeskUserById(ticket_comment.author_id);
    }    
  } ],
  segments: [],
});