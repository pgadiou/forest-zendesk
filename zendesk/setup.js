"use strict";

var _ = require('lodash');

var _require = require('forest-express/dist/utils/integrations'),
    pushIntoApimap = _require.pushIntoApimap;

var INTEGRATION_NAME = 'zendesk';

exports.createCollections = function (Implementation, apimap, collectionAndFieldName) {

  pushIntoApimap(apimap, {
    name: "zendesk_tickets",
    displayName: "Zendesk Tickets",
    icon: 'comments-o',
    integration: INTEGRATION_NAME,
    isVirtual: true,
    isReadOnly: true,
    paginationType: 'cursor',
    fields: [{
      field: 'id',
      type: 'Number',
      isFilterable: false
    }, {
      field: 'created_at',
      type: 'Date',
      isFilterable: false
    }, {
      field: 'updated_at',
      type: 'Date',
      isFilterable: false
    }, {
      field: 'type',
      type: 'String',
      isFilterable: true
    }, {
      field: 'status',
      type: 'String',
      isFilterable: false
    }, {
      field: 'subject',
      type: 'String',
      isFilterable: false
    }, {
      field: 'description',
      type: 'String',
      isFilterable: false
    }, {
      field: 'comment_count',
      type: 'Number',
      isFilterable: false
    }, {
      field: 'requester',
      type: 'String',
      reference: 'zendesk_users.id',
      isFilterable: true
    }, {
      field: 'submitter',
      type: 'String',
      reference: 'zendesk_users.id',
      isFilterable: true
    }, {
      field: 'assignee',
      type: 'String',
      reference: 'zendesk_users.id',
      isFilterable: true
    } ],
    actions: []
  });
  pushIntoApimap(apimap, {
    name: "zendesk_users",
    displayName: "Zendesk Users",
    icon: 'comments-o',
    integration: INTEGRATION_NAME,
    isVirtual: true,
    isReadOnly: true,
    paginationType: 'cursor',
    fields: [{
      field: 'id',
      type: 'Number',
      isFilterable: false
    }, {
      field: 'name',
      type: 'String',
      isFilterable: true
    }, {
      field: 'email',
      type: 'String',
      isFilterable: true
    }, {
      field: 'role',
      type: 'String',
      isFilterable: true
    }, {
      field: 'phone',
      type: 'String',
      isFilterable: false
    }, {
      field: 'last_login_at',
      type: 'Date',
      isFilterable: false
    }, {
      field: 'verified',
      type: 'Boolean',
      isFilterable: true
    }, {
      field: 'active',
      type: 'Boolean',
      isFilterable: true
    }, {
      field: 'created_at',
      type: 'Date',
      isFilterable: false
    }, {
      field: 'updated_at',
      type: 'Date',
      isFilterable: false
    }]
  });
};

exports.createFields = function (implementation, model, schemaFields) {
  schemaFields.push({
    field: 'zendesk_tickets',
    displayName: 'Tickets',
    type: ['String'],
    reference: "zendesk_tickets.id",
    column: null,
    isFilterable: false,
    isVirtual: true,
    integration: INTEGRATION_NAME
  });
};