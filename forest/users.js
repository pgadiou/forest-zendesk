/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');

const {getZendeskUserByEmail} = require('../services/zendesk-users-service');

collection('users', {
  actions: [],
  fields: [
  {
    field: 'ze_requested_tickets',
    type: ['String'],
    reference: 'zendesk_tickets.id',
  },
  {
    field: 'fullName',
    type: 'String',
    get: (user) => {
      return `${user.firstname} ${user.lastname}`;
    }
  },
  {
    field: 'zendesk_user',
    type: 'String',
    reference: 'zendesk_users.id',
    get: async (user) => {
      return await getZendeskUserByEmail(user.email);
    }
  },
  ],
  segments: [],
});
