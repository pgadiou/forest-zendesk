/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('zendesk_tickets');

const {getTickets, getTicket} = require('../services/tickets-getter');


// Get a list of Zendesk Tickets
router.get('/zendesk_tickets', permissionMiddlewareCreator.list(), (request, response, next) => {
  getTickets(request, response, next);
});

// Get a Zendesk Tickets
router.get('/zendesk_tickets/:ticketId', permissionMiddlewareCreator.details(), (request, response, next) => {
  getTicket(request, response, next);
});

module.exports = router;
