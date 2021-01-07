const { collection } = require('forest-express-sequelize');

const UserUtil = require('../zendesk/services/user-util');
var ConfigStore = require('forest-express/dist/services/config-store');

const INTEGRATION_NAME = 'zendesk';

let userUtil = new UserUtil(process.env.ZENDESK_API_TOKEN);


const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

collection('users', {
  actions: [],
  fields: [
  // {
  //   field: 'zen_tickets',
  //   type: ['String'],
  //   reference: 'users.id',
  //   //integration: INTEGRATION_NAME,
  // }
  ],
  segments: [],
});
