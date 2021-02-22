"use strict";
/* eslint-disable no-undef */

var _ = require('lodash');
const { RecordSerializer } = require('forest-express');

const constants = require('../zendesk/constants');

var IntegrationInformationsGetter = require('forest-express/dist/services/integration-informations-getter');

var TicketsGetter = require('./services/tickets-getter');
var TicketGetter = require('./services/ticket-getter');
var TicketUpdater = require('./services/ticket-updater');
var TicketsCommentsGetter = require('./services/tickets-comments-getter');

var UsersGetter = require('./services/users-getter');
var UserGetter = require('./services/user-getter');

var GroupsGetter = require('./services/groups-getter');
var GroupGetter = require('./services/group-getter');

var OrganizationsGetter = require('./services/organizations-getter');
var OrganizationGetter = require('./services/organization-getter');

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

  var getTicketsComments = function (request, response, next) {
    new TicketsCommentsGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    .then(async function ([count, records]) {
      serializeRecords(records, count, constants.ZENDESK_TICKETS_COMMENTS, request, response);
    })["catch"](next);
  };

  var getTicketsComment = function (request, response, next) {
    request.params.parentRelationshipId = request.params.composedId.split('|')[0];
    new TicketsCommentsGetter(Implementation, _.extend(request.query, request.params), request.user, opts, integrationInfo).perform()
    // eslint-disable-next-line no-unused-vars
    .then(async function ([count, records]) {
      serializeRecord(records.filter(record => record.id===request.params.composedId)[0], constants.ZENDESK_TICKETS_COMMENTS, request, response);
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


  var actionChangeTicketPriority = function (request, response, next) {
    const values = request.body.data.attributes.values;
    new TicketUpdater(Implementation, _.extend(request.body, request.params), request.user, opts, integrationInfo)
    .update({
      priority: values[constants.ZENDESK_ACTION_FORM_CHANGE_TICKET_PRIORITY],
    })
    // eslint-disable-next-line no-unused-vars
    .then(async function (record) {
      response.send({
//        success: '',
        refresh: { relationships: [constants.ZENDESK_TICKET_COMMENTS_RELATIONSHIP] },
      });
    })["catch"](next);
  };

  var actionAddComment = function (request, response, next) {
    const values = request.body.data.attributes.values;
    new TicketUpdater(Implementation, _.extend(request.body, request.params), request.user, opts, integrationInfo)
    .update({
      comment: {
        body: values[constants.ZENDESK_ACTION_FORM_ADD_COMMENT_CONTENT],
        public: values[constants.ZENDESK_ACTION_FORM_ADD_COMMENT_PUBLIC] === 'Public',
      }
    })
    // eslint-disable-next-line no-unused-vars
    .then(async function (record) {
      response.send({
//        success: '',
        refresh: { relationships: [constants.ZENDESK_TICKET_COMMENTS_RELATIONSHIP] },
      });
    })["catch"](next);
  };

  // eslint-disable-next-line no-unused-vars
  var performActionTicketHookLoad = function (request, response, next) {
    const recordId = request.body.recordIds[0]; 
    new TicketGetter(Implementation, _.extend({ticketId: recordId}), request.user, opts, integrationInfo).perform()
    .then((record) => {
      let schema =  Implementation.Schemas.schemas[request.body.collectionName];
      let action = schema.actions.filter (a => request.url.startsWith(a.endpoint))[0];
      if (action && action.hooks && action.hooks.change) {
        let result = action.hooks.load({fields: _.keyBy(action.fields, 'field'), record, user: request.user});
        response.send({fields: _.values(result)});  
      }  
    })

  }


  this.perform = function () {
    if (integrationInfo) {
      app.post(`${constants.ZENDESK_ACTION_ENDPOINT_ADD_COMMENT}`, auth.ensureAuthenticated, actionAddComment);
      app.post(`/forest/actions/zendesk-ticket-*/hooks/load`, auth.ensureAuthenticated, performActionTicketHookLoad);
      app.post(`${constants.ZENDESK_ACTION_ENDPOINT_CHANGE_TICKET_PRIORITY}`, auth.ensureAuthenticated, actionChangeTicketPriority);

      app.get(path.generate(`${constants.ZENDESK_TICKETS}`, opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate(`/:recordId/${constants.ZENDESK_TICKETS}`, opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate(`${constants.ZENDESK_TICKETS}/:ticketId`, opts), auth.ensureAuthenticated, getTicket);
      app.get(path.generate(`${constants.ZENDESK_USERS}/:parentRelationshipId/relationships/${constants.ZENDESK_REQUESTED_TICKETS}`, opts), auth.ensureAuthenticated, getTickets);
  
      // Route from user model to tickets => smart relationship
      app.get(path.generate("".concat(modelName,`/:modelNameRelationshipId/relationships/${constants.ZENDESK_REQUESTED_TICKETS}`), opts), auth.ensureAuthenticated, getTickets);

      app.get(path.generate(`${constants.ZENDESK_TICKETS}/:parentRelationshipId/relationships/${constants.ZENDESK_TICKET_COMMENTS_RELATIONSHIP}`, opts), auth.ensureAuthenticated, getTicketsComments);
      app.get(path.generate(`${constants.ZENDESK_TICKETS_COMMENTS}/:composedId`, opts), auth.ensureAuthenticated, getTicketsComment);


      app.get(path.generate(`${constants.ZENDESK_USERS}`, opts), auth.ensureAuthenticated, getUsers);
      app.get(path.generate(`/:recordId/${constants.ZENDESK_USERS}`, opts), auth.ensureAuthenticated, getUsers);
      app.get(path.generate(`${constants.ZENDESK_USERS}/:userId`, opts), auth.ensureAuthenticated, getUser);    

      app.get(path.generate(`${constants.ZENDESK_GROUPS}`, opts), auth.ensureAuthenticated, getGroups);
      app.get(path.generate(`/:recordId/${constants.ZENDESK_GROUPS}`, opts), auth.ensureAuthenticated, getGroups);
      app.get(path.generate(`${constants.ZENDESK_GROUPS}/:groupId`, opts), auth.ensureAuthenticated, getGroup);    
      app.get(path.generate(`${constants.ZENDESK_USERS}/:parentRelationshipId/relationships/${constants.ZENDESK_USER_GROUPS}`, opts), auth.ensureAuthenticated, getGroups);

      app.get(path.generate(`${constants.ZENDESK_ORGANIZATIONS}`, opts), auth.ensureAuthenticated, getOrganizations);
      app.get(path.generate(`/:recordId/${constants.ZENDESK_ORGANIZATIONS}`, opts), auth.ensureAuthenticated, getOrganizations);
      app.get(path.generate(`${constants.ZENDESK_ORGANIZATIONS}/:organizationId`, opts), auth.ensureAuthenticated, getOrganization);    
      app.get(path.generate(`${constants.ZENDESK_USERS}/:parentRelationshipId/relationships/${constants.ZENDESK_USER_ORGANIZATIONS}`, opts), auth.ensureAuthenticated, getOrganizations);

    }
  };
};