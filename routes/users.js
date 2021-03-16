/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');
const { users } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('users');

const {getTickets} = require('../services/zendesk-tickets-service');

// Create a User
router.post('/users', permissionMiddlewareCreator.create(), (request, response, next) => {
  next();
});

// Update a User
router.put('/users/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  next();
});

// Delete a User
router.delete('/users/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  next();
});

// Get a list of Users
router.get('/users', permissionMiddlewareCreator.list(), (request, response, next) => {
  next();
});

// Get a number of Users
router.get('/users/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  next();
});

// Get a User
router.get('/users/:recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
  next();
});

// Export a list of Users
router.get('/users.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  next();
});

// Delete a list of Users
router.delete('/users', permissionMiddlewareCreator.delete(), (request, response, next) => {
  next();
});

router.get('/users/:userId/relationships/ze_requested_tickets', async (request, response, next) => {
    // Get the user email for filtering on requester
    const user = await users.findByPk(request.params.userId);
    const additionalFilter = `requester:${user.email}`;
    getTickets(request, response, next, additionalFilter);
});


module.exports = router;
