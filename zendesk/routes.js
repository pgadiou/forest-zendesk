"use strict";

var _ = require('lodash');
const { RecordSerializer } = require('forest-express');
//const { RecordSerializer } = require('forest-express-sequelize');

var IntegrationInformationsGetter = require('forest-express/dist/services/integration-informations-getter');

var TicketsGetter = require('./services/tickets-getter');
var TicketGetter = require('./services/ticket-getter');
var UsersGetter = require('./services/users-getter');
var UserGetter = require('./services/user-getter');

// var serializeTickets = require('./serializers/tickets');
// var serializeUsers = require('./serializers/users');

var auth = require('forest-express/dist/services/auth');
var path = require('forest-express/dist/services/path');

module.exports = function Routes(app, model, Implementation, opts) {
  var modelName = Implementation.getModelName(model);
  var integrationInfo;

  if (opts) {
    integrationInfo = new IntegrationInformationsGetter(modelName, Implementation, opts).perform();
  }

  if (integrationInfo) {
    var SEPARATOR = '.';
    var integrationValues = integrationInfo.split(SEPARATOR);
    integrationInfo = {
      collection: Implementation.getModels()[integrationValues[0]],
      field: integrationValues[1],
      embeddedPath: integrationValues.slice(2).join(SEPARATOR) || null
    };
  }

  var getTickets = function getTickets(request, response, next) {
    new TicketsGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function ([count, records]) {
      for (let record of records) { record.currentUser = request.user}
      const recordsSerializer = new RecordSerializer({ name: 'zendesk_tickets' });
      const recordsSerialized = await recordsSerializer.serialize(records);
      response.send({ ...recordsSerialized, meta:{ count: count }});
    })["catch"](next);
  };

  var getTicket = function getTicket(request, response, next) {
    new TicketGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function (record) {
      record.currentUser = request.user;
      const recordsSerializer = new RecordSerializer({ name: 'zendesk_tickets' });
      const recordSerialized = await recordsSerializer.serialize(record);
      response.send(recordSerialized);
    })["catch"](next);
  };

  var getUsers = function getUsers(request, response, next) {
    new UsersGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function ([count, records]) {
      for (let record of records) { record.currentUser = request.user; }
      const recordsSerializer = new RecordSerializer({ name: 'zendesk_users' });
      const recordsSerialized = await recordsSerializer.serialize(records);
      response.send({ ...recordsSerialized, meta:{ count: count }});
    })["catch"](next);
  };

  var getUser = function getUser(request, response, next) {
    new UserGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function (record) {
      record.currentUser = request.user;
      const recordsSerializer = new RecordSerializer({ name: 'zendesk_users' });
      const recordSerialized = await recordsSerializer.serialize(record);
      response.send(recordSerialized);
    })["catch"](next);
  };

  this.perform = function () {
    if (integrationInfo) {

      app.get(path.generate("zendesk_tickets", opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate("/:recordId/zendesk_tickets", opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate("zendesk_tickets/:ticketId", opts), auth.ensureAuthenticated, getTicket);
      app.get(path.generate("zendesk_users/:recordId/relationships/ze_requested_tickets", opts), auth.ensureAuthenticated, getTickets);
  
      // Route from user model to tickets => smart relationship
      app.get(path.generate("".concat(modelName,"/:recordId/relationships/ze_requested_tickets"), opts), auth.ensureAuthenticated, getTickets);

      app.get(path.generate("zendesk_users", opts), auth.ensureAuthenticated, getUsers);
      app.get(path.generate("/:recordId/zendesk_users", opts), auth.ensureAuthenticated, getUsers);
      app.get(path.generate("zendesk_users/:userId", opts), auth.ensureAuthenticated, getUser);    }
  };
};