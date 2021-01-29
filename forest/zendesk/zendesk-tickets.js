const { collection } = require('forest-express-sequelize');
const constants = require('../../zendesk/constants');
const TicketGetter = require('../../zendesk/services/ticket-getter');

collection(constants.ZENDESK_TICKETS, {
  // isSearchable: true,
  actions: [{
    name: 'Add Comment',
    type: 'single',
    endpoint: constants.ZENDESK_ACTION_ENDPOINT_ADD_COMMENT,
    fields: [
      {
        field: constants.ZENDESK_ACTION_FORM_ADD_COMMENT_CONTENT,
        description: 'Input the Text for your comment',
        type: 'String',
        isRequired: true
      },
      {
        field: constants.ZENDESK_ACTION_FORM_ADD_COMMENT_PUBLIC,
        description: 'Is your comment private or public?',
        type: 'Enum',
        enums: ['Private', 'Public'],
        isRequired: true
      },
    ],
    hooks: {
      load: ({ fields, record }) => {
        fields[constants.ZENDESK_ACTION_FORM_ADD_COMMENT_PUBLIC].value = 'Private';
        return fields;
      },
      change: {
      },
    },    
  }, {
    name: 'Change Priority',
    type: 'single',
    endpoint: constants.ZENDESK_ACTION_ENDPOINT_CHANGE_TICKET_PRIORITY,
    fields: [
      {
        field: constants.ZENDESK_ACTION_FORM_CHANGE_TICKET_PRIORITY,
        description: 'What is the new priority?',
        type: 'Enum',
        enums: constants.ZENDESK_TICKETS_PRIORITY_ENUM,
        isRequired: true
      },
    ],
    hooks: {
      load: ({ fields, record}) => {
        fields[constants.ZENDESK_ACTION_FORM_CHANGE_TICKET_PRIORITY].value = record.priority;
        return fields;
      },
      change: {
      },
    },    
  }],
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
    enums: constants.ZENDESK_TICKETS_PRIORITY_ENUM,
    isSortable: true,
  }, {
    field: 'status',
    type: 'Enum',
    enums: constants.ZENDESK_TICKETS_STATUS_ENUM,
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
  }, {
    field: constants.ZENDESK_TICKET_COMMENTS_RELATIONSHIP,
    type: ['String'],
    reference: `${constants.ZENDESK_TICKETS_COMMENTS}.id`,
  } ],
  segments: [],
});
