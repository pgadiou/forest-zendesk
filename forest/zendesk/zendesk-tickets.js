const { collection } = require('forest-express-sequelize');
const constants = require('../../zendesk/constants');

collection(constants.ZENDESK_TICKETS, {
  // isSearchable: true,
  actions: [],
  fields: [{
    field: 'id',
    type: 'Number',
  }, {
    field: 'created_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'updated_at',
    type: 'Date',
    isSortable: true,
  }, {
    field: 'type',
    type: 'Enum',
    enums: ["problem", "incident", "question", "task"],
    isSortable: true,
  }, {
    field: 'priority',
    type: 'Enum',
    enums: ["urgent", "high", "normal", "low"],
    isSortable: true,
  }, {
    field: 'status',
    type: 'Enum',
    enums: ["new", "open", "pending", "hold", "solved", "closed"],
    isSortable: true,
  }, {
    field: 'subject',
    type: 'String',
    // isSortable: true,
  }, {
    field: 'description',
    type: 'String',
  }, {
    field: 'comment_count',
    type: 'Number',
  }, {
    field: 'requester',
    type: 'String',
    reference: `${constants.ZENDESK_USERS}.id`,
  }, {
    field: 'submitter',
    type: 'String',
    reference: `${constants.ZENDESK_USERS}.id`,
  }, {
    field: 'assignee',
    type: 'String',
    reference: `${constants.ZENDESK_USERS}.id`,
  }, {
    field: 'direct_url',
    type: 'String',
  }, {
    field: 'is_public',
    type: 'Boolean',
  }, {
    field: 'satisfaction_rating',
    type: 'Json',
  }, {
    field: 'tags',
    type: ['String'],
  }, {
    field: 'requester_filtering_only',
    type: 'String',
  }, {
    field: 'submitter_filtering_only',
    type: 'String',
  }, {
    field: 'assignee_filtering_only',
    type: 'String',
  }, {
    field: 'created_filtering_only',
    type: 'Dateonly',
  }, {
    field: 'updated_filtering_only',
    type: 'Dateonly',
  }, {
    field: 'solved_filtering_only',
    type: 'Dateonly',
  }, {
    field: 'due_date_filtering_only',
    type: 'Dateonly',
  } ],
  segments: [],
});
