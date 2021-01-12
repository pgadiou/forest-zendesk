const { collection } = require('forest-express-sequelize');

const UserUtil = require('../zendesk/services/user-util');
let userUtil = new UserUtil(process.env.ZENDESK_API_TOKEN);

collection('users', {
  actions: [],
  fields: [
  {
    //TODO: how to make it configurable?
    field: 'ze_requested_tickets',
    type: ['String'],
    reference: 'zendesk_users.id',
  },
  {
    //TODO: how to make it configurable?
    field: 'zendesk_user',
    type: 'String',
    reference: 'zendesk_users.id',
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
