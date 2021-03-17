/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('zendesk_tickets');

const {getTickets, getTicket, udpateTicket} = require('../services/zendesk-tickets-service');
const {getTicketsComments} = require('../services/zendesk-tickets-comments-service');

// Get a list of Zendesk Tickets
router.get('/zendesk_tickets', permissionMiddlewareCreator.list(), (request, response, next) => {
  getTickets(request, response, next);
});

// Get a Zendesk Ticket
router.get('/zendesk_tickets/:ticketId', permissionMiddlewareCreator.details(), (request, response, next) => {
  getTicket(request, response, next);
});

router.post('/actions/zendesk-ticket-change-priority', permissionMiddlewareCreator.smartAction(), (request, response, next) => {
  const ticketId = request.body.data.attributes.ids[0];
  const newValues = {
    priority: request.body.data.attributes.values['New Ticket Priority'],
  };

  udpateTicket(ticketId, newValues)
  // eslint-disable-next-line no-unused-vars
  .then(async function (recordUpdated) {
    response.send({
      success: 'Ticket Priority changed!',
    });
  })
  .catch(next);
});

router.get('/zendesk_tickets/:ticketId/relationships/ze_tickets_comments', async (request, response, next) => {
  // filtering on requester_id
  getTicketsComments(request, response, next, request.params.ticketId);
});

module.exports = router;
