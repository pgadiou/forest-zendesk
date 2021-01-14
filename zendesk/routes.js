"use strict";

var _ = require('lodash');
const { RecordSerializer } = require('forest-express');

const constants = require('../zendesk/constants');

var IntegrationInformationsGetter = require('forest-express/dist/services/integration-informations-getter');

var TicketsGetter = require('./services/tickets-getter');
var TicketGetter = require('./services/ticket-getter');
var UsersGetter = require('./services/users-getter');
var UserGetter = require('./services/user-getter');
var GroupsGetter = require('./services/groups-getter');
var GroupGetter = require('./services/group-getter');
var OrganizationsGetter = require('./services/organizations-getter');
var OrganizationGetter = require('./services/organization-getter');

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

  var serializeRecords = async function (records, count, recordModelName, request, response) {
    for (let record of records) { record.currentUser = request.user}
    const recordsSerializer = new RecordSerializer({ name: recordModelName });
    const recordsSerialized = await recordsSerializer.serialize(records);
    response.send({ ...recordsSerialized, meta:{ count: count }});
  }

  var serializeRecord = async function (record, recordModelName, request, response) {
    record.currentUser = request.user;
    const recordsSerializer = new RecordSerializer({ name: recordModelName });
    const recordSerialized = await recordsSerializer.serialize(record);
    response.send(recordSerialized);
  }

  var getTickets = function (request, response, next) {
    new TicketsGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function ([count, records]) {
      serializeRecords(records, count, constants.ZENDESK_TICKETS, request, response);
    })["catch"](next);
  };

  var getTicket = function (request, response, next) {
    new TicketGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function (record) {
      serializeRecord(record, constants.ZENDESK_TICKETS, request, response);
    })["catch"](next);
  };

  var getUsers = function (request, response, next) {
    new UsersGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function ([count, records]) {
      serializeRecords(records, count, constants.ZENDESK_USERS, request, response);
    })["catch"](next);
  };

  var getUser = function (request, response, next) {
    new UserGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function (record) {
      serializeRecord(record, constants.ZENDESK_USERS, request, response);
    })["catch"](next);
  };

  var getGroups = function (request, response, next) {
    new GroupsGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function ([count, records]) {
      serializeRecords(records, count, constants.ZENDESK_GROUPS, request, response);
    })["catch"](next);
  };

  var getGroup = function (request, response, next) {
    new GroupGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function (record) {
      serializeRecord(record, constants.ZENDESK_GROUPS, request, response);
    })["catch"](next);
  };



  var getOrganizations = function (request, response, next) {
    new OrganizationsGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function ([count, records]) {
      serializeRecords(records, count, constants.ZENDESK_ORGANIZATIONS, request, response);
    })["catch"](next);
  };

  var getOrganization = function (request, response, next) {
    new OrganizationGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function (record) {
      serializeRecord(record, constants.ZENDESK_ORGANIZATIONS, request, response);
    })["catch"](next);
  };  

  this.perform = function () {
    if (integrationInfo) {

      app.get(path.generate(`${constants.ZENDESK_TICKETS}`, opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate(`/:recordId/${constants.ZENDESK_TICKETS}`, opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate(`${constants.ZENDESK_TICKETS}/:ticketId`, opts), auth.ensureAuthenticated, getTicket);
      app.get(path.generate(`${constants.ZENDESK_USERS}/:parentRelationshipId/relationships/${constants.ZENDESK_REQUESTED_TICKETS}`, opts), auth.ensureAuthenticated, getTickets);
  
      // Route from user model to tickets => smart relationship
      app.get(path.generate("".concat(modelName,`/:modelNameRelationshipId/relationships/${constants.ZENDESK_REQUESTED_TICKETS}`), opts), auth.ensureAuthenticated, getTickets);

      app.get(path.generate(`${constants.ZENDESK_USERS}`, opts), auth.ensureAuthenticated, getUsers);
      app.get(path.generate(`/:recordId/${constants.ZENDESK_USERS}`, opts), auth.ensureAuthenticated, getUsers);
      app.get(path.generate(`${constants.ZENDESK_USERS}/:userId`, opts), auth.ensureAuthenticated, getUser);    

      app.get(path.generate(`${constants.ZENDESK_GROUPS}`, opts), auth.ensureAuthenticated, getGroups);
      app.get(path.generate(`/:recordId/${constants.ZENDESK_GROUPS}`, opts), auth.ensureAuthenticated, getGroups);
      app.get(path.generate(`${constants.ZENDESK_GROUPS}/:groupId`, opts), auth.ensureAuthenticated, getGroup);    

      app.get(path.generate(`${constants.ZENDESK_ORGANIZATIONS}`, opts), auth.ensureAuthenticated, getOrganizations);
      app.get(path.generate(`/:recordId/${constants.ZENDESK_ORGANIZATIONS}`, opts), auth.ensureAuthenticated, getOrganizations);
      app.get(path.generate(`${constants.ZENDESK_ORGANIZATIONS}/:organizationId`, opts), auth.ensureAuthenticated, getOrganization);    

    }
  };
};