const { collection } = require('forest-express-sequelize');
const constants = require('../../zendesk/constants');

collection(constants.ZENDESK_TICKETS_COMMENTS, {
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
    reference: `${constants.ZENDESK_USERS}.id`,
  } ],
  segments: [],
});
