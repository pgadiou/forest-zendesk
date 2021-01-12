const { collection } = require('forest-express-sequelize');
const { Zendesk } = require('../../zendesk');

collection('zendesk_users', {
  actions: [],
  fields: [{
    field: 'id',
    type: 'String',
  }, {
    field: 'name',
    type: 'String',
  }, {
    field: 'email',
    type: 'String',
  }, {
    field: 'role',
    type: 'String',
  }, {
    field: 'phone',
    type: 'String',
  }, {
    field: 'last_login_at',
    type: 'Date',
  }, {
    field: 'verified',
    type: 'Boolean',
  }, {
    field: 'active',
    type: 'Boolean',
  }, {
    field: 'created_at',
    type: 'Date',
  }, {
    field: 'updated_at',
    type: 'Date',
  }, {
    field: 'direct_url',
    type: 'String',
  }, {
    field: 'ze_requested_tickets',
    type: ['String'],
    reference: 'zendesk_users.id',
  }, {
    field: 'user',
    type: 'String',
    //TODO: how to make this configurable?
    reference: 'users.id', 
    get: async (zendesk_user) => {
      const user = await Zendesk.getUserByUserField('users', 'email', zendesk_user.email);
      return user;
    }

  } ],
  segments: [],
});
