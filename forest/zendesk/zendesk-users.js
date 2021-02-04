/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');
const { Zendesk } = require('../../zendesk');
const constants = require('../../zendesk/constants');

// Search on users => https://support.zendesk.com/hc/en-us/articles/203663216-Searching-users-groups-and-organizations#topic_duj_sbb_vc
collection(constants.ZENDESK_USERS, {
  isSearchable: true,
  actions: [],
  fields: [{
    field: 'id',
    type: 'String',
    isFilterable: false, // Zendesk API does not provide such capacity with the API
  }, {
    field: 'name',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'alias',
    type: 'String',
  }, {
    field: 'email',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'role',
    type: 'Enum',
    enums: ["end-user", "agent", "admin"],
    isFilterable: true,
  }, {
    field: 'role_type',
    type: 'Number',
  }, {
    field: 'phone',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'whatsapp',
    type: 'String',
    isFilterable: true,
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
    isFilterable: true,
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
    isFilterable: true,
  }, {
    field: 'details',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'tags',
    type: ['String'],
    isFilterable: true,// is it possible? => no arrays are not yet filterable
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
    field: 'external_id',
    type: 'String',
    isFilterable: true,
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
    isFilterable: true,
  }, {
    field: 'organization_filtering_only',
    type: 'String',
    isFilterable: true,
  }, {
    field: 'created_filtering_only',
    type: 'Dateonly',
    isFilterable: true,
  }, {
    field: 'updated_filtering_only',
    type: 'Dateonly',
  }, {
    field: 'default_group',
    type: 'String',
    reference: `${constants.ZENDESK_GROUPS}.id`,
  }, {
    field: 'default_organization',
    type: 'String',
    reference: `${constants.ZENDESK_ORGANIZATIONS}.id`,
  }, {
    field: 'is_verified_filtering_only',
    type: 'Boolean',
    isFilterable: true,
  }, {
    field: 'is_suspended_filtering_only',
    type: 'Boolean',
    isFilterable: true,
  }, {
    field: 'is_active_filtering_only', // not working?
    type: 'Boolean',
    isFilterable: true,
  }, {
    field: constants.ZENDESK_USER_GROUPS,
    type: ['String'],
    reference: `${constants.ZENDESK_GROUPS}.id`,
  }, {
    field: constants.ZENDESK_USER_ORGANIZATIONS,
    type: ['String'],
    reference: `${constants.ZENDESK_ORGANIZATIONS}.id`,
  } ],
  segments: [],
});
