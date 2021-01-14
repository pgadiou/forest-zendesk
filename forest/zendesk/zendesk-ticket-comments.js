const { collection } = require('forest-express-sequelize');
const constants = require('../../zendesk/constants');

collection(constants.ZENDESK_TICKETS_COMMENTS, {
  actions: [],
  fields: [{
    field: 'id',
    type: 'Number',

  } ],
  segments: [],
});
