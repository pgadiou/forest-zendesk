/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('zendesk_users');

const {getUsers, getUser} = require('../services/zendesk-users-service');
const {getTickets} = require('../services/zendesk-tickets-service');

// Get a list of Zendesk Users
router.get('/zendesk_users', permissionMiddlewareCreator.list(), (request, response, next) => {
  getUsers(request, response, next);
});

// Get a Zendesk Users
router.get('/zendesk_users/:userId', permissionMiddlewareCreator.details(), (request, response, next) => {
  getUser(request, response, next);
});

router.get('/zendesk_users/:userId/relationships/ze_requested_tickets', async (request, response, next) => {
  // filtering on requester_id
  getTickets(request, response, next, `requester_id:${request.params.userId}`);
});

module.exports = router;
