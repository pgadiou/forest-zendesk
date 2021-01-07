"use strict";

var _ = require('lodash');

var JSONAPISerializer = require('jsonapi-serializer').Serializer;

var Schemas = require('forest-express/dist/generators/schemas');

function serializeTickets(tickets, collectionName, meta) {
  // function getUserAttributes() {
  //   if (!tickets.length) {
  //     return [];
  //   }

  //   var schema = Schemas.schemas[collectionName];

  //   if (!schema) {
  //     return [];
  //   }

  //   return _.map(schema.fields, 'field');
  // }

  function getZendeskUserAttributes() {
    if (!tickets.length) {
      return [];
    }

    var schema = Schemas.schemas['zendesk_users'];

    if (!schema) {
      return [];
    }

    return _.map(schema.fields, 'field');
  }

  function format(ticket) {
    // jshint camelcase: false
    return ticket;
  }

  var zendeskUserAttributes = getZendeskUserAttributes();

  if (tickets.length) {
    tickets = tickets.map(format);
  } else {
    tickets = format(tickets);
  }

  var type = "zendesk_tickets";
  return new JSONAPISerializer(type, tickets, {
    attributes: ['type', 'status', 'subject', 'description', 'requester', 'submitter', 'assignee', 'created_at', 'updated_at', 'comment_count', 'direct_url'],
    requester: {
      ref: 'id',
      attributes: zendeskUserAttributes
    },
    assignee: {
      ref: 'id',
      attributes: zendeskUserAttributes
    },
    submitter: {
      ref: 'id',
      attributes: zendeskUserAttributes
    },
    keyForAttribute: function keyForAttribute(key) {
      return key;
    },
    typeForAttribute: function typeForAttribute(attr) {
      if (attr === 'requester' || attr === 'assignee' || attr === 'submitter') {
        return 'zendesk_users';
      }

      return attr;
    },
    meta: meta
  });
}

module.exports = serializeTickets;