/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');
const constants = require('../../zendesk/constants');

collection(constants.ZENDESK_GROUPS, {
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
    field: 'description',
    type: 'String',
  }, {
    field: 'default',
    type: 'Boolean',
  }, {
    field: 'deleted',
    type: 'Boolean',
  }, {
    field: 'url',
    type: 'String',
   }, ],
  segments: [],
});
