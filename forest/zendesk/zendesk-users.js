const { collection } = require('forest-express-sequelize');
const { Zendesk } = require('../../zendesk');
const constants = require('../../zendesk/constants');

collection(constants.ZENDESK_USERS, {
  isSearchable: true,
  actions: [],
  fields: [{
    field: 'id',
    type: 'String',
  }, {
    field: 'name',
    type: 'String',
  }, {
    field: 'alias',
    type: 'String',
  }, {
    field: 'email',
    type: 'String',
  }, {
    field: 'role',
    type: 'Enum',
    enums: ["end-user", "agent", "admin"],
  }, {
    field: 'role_type',
    type: 'Number',
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
    field: 'suspended',
    type: 'Boolean',
  }, {
    field: 'created_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'updated_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'last_login_at',
    type: 'Date',
  }, {
    field: 'direct_url',
    type: 'String',
  }, {
    field: 'notes',
    type: 'String',
  }, {
    field: 'details',
    type: 'String',
  }, {
    field: 'tags',
    type: ['String'],
  // }, {
  //   field: 'iana_time_zone',
  //   type: 'String',
  }, {
    field: 'time_zone',
    type: 'String',
  }, {
    field: 'moderator',
    type: 'Boolean',
  }, {
    field: 'only_private_comments',
    type: 'Boolean',
  }, {
    field: 'photo_url',
    type: 'File',
    get: (user) => {
      return user.photo ? user.photo.content_url : null;
    }
  }, {
    field: constants.ZENDESK_REQUESTED_TICKETS,
    type: ['String'],
    reference: `${constants.ZENDESK_TICKETS}.id`,
  }, {
    field: 'user',
    type: 'String',
    //TODO: how to make this configurable?
    reference: 'users.id', 
    get: async (zendesk_user) => {
      const user = await Zendesk.getUserByUserField('email', zendesk_user.email);
      return user;
    }
  }, {
    field: 'group_filtering_only',
    type: 'String',
  }, {
    field: 'organization_filtering_only',
    type: 'String',
  }, {
    field: 'created_filtering_only',
    type: 'Dateonly',
  }, {
    field: 'updated_filtering_only',
    type: 'Dateonly',
  }, {
    field: 'default_group',
    type: 'String',
    reference:'zendesk_groups.id',
  }, {
    field: 'default_organization',
    type: 'String',
    reference:'zendesk_organizations.id',
  }, {
    field: 'groups',
    type: ['String'],
    reference:'zendesk_groups.id',
  }, {
    field: 'organizations',
    type: ['String'],
    reference:'zendesk_organizations.id',
  } ],
  segments: [],
});
