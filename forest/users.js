/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');

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
  }
  ],
  segments: [],
});
