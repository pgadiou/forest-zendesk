"use strict";

var _ = require('lodash');

var IntegrationInformationsGetter = require('forest-express/dist/services/integration-informations-getter');

var TicketsGetter = require('./services/tickets-getter');
var TicketGetter = require('./services/ticket-getter');

var serializeTickets = require('./serializers/tickets');

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
    new TicketsGetter(Implementation, _.extend(request.query, request.params), opts, integrationInfo).perform().then(function (results) {
      var count = results[0];
      var tickets = results[1];
      return serializeTickets(tickets, modelName, {
        count: count
      });
    }).then(function (tickets) {
      response.send(tickets);
    })["catch"](next);
  };

  var getTicket = function getTicket(request, response, next) {
    new TicketGetter(Implementation, _.extend(request.query, request.params), opts, integrationInfo).perform().then(function (ticket) {
      return serializeTickets(ticket, modelName);
    }).then(function (ticket) {
      response.send(ticket);
    })["catch"](next);
  };

  this.perform = function () {
    if (integrationInfo) {

      app.get(path.generate("zendesk_tickets", opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate("/:recordId/zendesk_tickets", opts), auth.ensureAuthenticated, getTickets);
      app.get(path.generate("zendesk_tickets/:ticketId", opts), auth.ensureAuthenticated, getTicket);
    }
  };
};