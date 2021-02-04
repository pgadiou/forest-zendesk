/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');

const UserUtil = require('../zendesk/services/user-util');
let userUtil = new UserUtil({
  apiKey: process.env.ZENDESK_API_TOKEN,
  authMethod: process.env.ZENDESK_AUTH_METHOD,
  serviceAccount: process.env.ZENDESK_SERVICE_ACCOUNT,
});
const constants = require('../zendesk/constants');

collection('users', {
  actions: [],
  fields: [
  {
    //TODO: how to make it configurable?
    field: constants.ZENDESK_REQUESTED_TICKETS,
    type: ['String'],
    reference: `${constants.ZENDESK_TICKETS}.id`,
  },
  {
    //TODO: how to make it configurable?
    field: 'zendesk_user',
    type: 'String',
    reference: `${constants.ZENDESK_USERS}.id`,
    get: async (user) => {
      const zendesk_user = await userUtil.findByEmail(user.email, user.currentUser);
      return zendesk_user;
    }
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
