"use strict";

var _ = require('lodash');

var JSONAPISerializer = require('jsonapi-serializer').Serializer;

var Schemas = require('forest-express/dist/generators/schemas');

function serializeTickets(tickets, collectionName, meta) {
  function getUserAttributes() {
    if (!tickets.length) {
      return [];
    }

    var schema = Schemas.schemas[collectionName];

    if (!schema) {
      return [];
    }

    return _.map(schema.fields, 'field');
  }

  function format(ticket) {
    // jshint camelcase: false
    return ticket;
  }

  var userAttributes = getUserAttributes();

  if (tickets.length) {
    tickets = tickets.map(format);
  } else {
    tickets = format(tickets);
  }

  var type = "zendesk_tickets";
  return new JSONAPISerializer(type, tickets, {
    attributes: ['type', 'status', 'subject', 'description', 'requester', 'created_at', 'updated_at', 'comment_count'],
    requester: {
      ref: Schemas.schemas[collectionName].idField,
      attributes: userAttributes
    },
    keyForAttribute: function keyForAttribute(key) {
      return key;
    },
    typeForAttribute: function typeForAttribute(attr) {
      if (attr === 'requester') {
        return collectionName;
      }

      return attr;
    },
    meta: meta
  });
}

module.exports = serializeTickets;