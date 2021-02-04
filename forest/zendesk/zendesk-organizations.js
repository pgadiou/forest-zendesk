/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');
const constants = require('../../zendesk/constants');

collection(constants.ZENDESK_ORGANIZATIONS, {
  actions: [],
  fields: [{
    field: 'id',
    type: 'Number',
  }, {
    field: 'created_at',
    type: 'Date',
  }, {
    field: 'updated_at',
    type: 'Date',
  }, {
    field: 'name',
    type: 'String',
  }, {
    field: 'details',
    type: 'String',
  }, {
    field: 'domain_names',
    type: ['String'],
  }, {
    field: 'notes',
    type: 'String',
  }, {
    field: 'shared_comments',
    type: 'Boolean',
  }, {
    field: 'shared_tickets',
    type: 'Boolean',
  }, {
    field: 'tags',
    type: ['String'],
  }, {
    field: 'url',
    type: 'String',
   }, ],

  segments: [],
});
