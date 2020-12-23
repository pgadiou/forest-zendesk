"use strict";

var _ = require('lodash');

var JSONAPISerializer = require('jsonapi-serializer').Serializer;

var Schemas = require('forest-express/dist/generators/schemas');

function serializeUsers(users, collectionName, meta) {

  function format(user) {
    // jshint camelcase: false
    return user;
  }
  
  if (users.length) {
    users = users.map(format);
  } else {
    users = format(users);
  }

  var type = "zendesk_users";
  return new JSONAPISerializer(type, users, {
    attributes: ['email', 'name', 'role', 'phone', 'last_login_at', 'verified', 'active', 'created_at', 'updated_at'],
    keyForAttribute: function keyForAttribute(key) {
      return key;
    },
    typeForAttribute: function typeForAttribute(attr) {

      return attr;
    },
    meta: meta
  });
}

module.exports = serializeUsers;