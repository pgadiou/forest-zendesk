/* eslint-disable no-undef */
const { collection } = require('forest-express-sequelize');

const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

// Search on users => https://support.zendesk.com/hc/en-us/articles/203663216-Searching-users-groups-and-organizations#topic_duj_sbb_vc
collection('zendesk_users', {
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
    enums: ['end-user', 'agent', 'admin'],
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
    get: (user) => {
      return `${ZENDESK_URL_PREFIX}/agent/users/${user.id}`;
    },        
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
  }, ],
  segments: [],
});
