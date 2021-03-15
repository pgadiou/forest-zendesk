/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('zendesk_users');

const {getUsers, getUser} = require('../services/users-getter');

// Get a list of Zendesk Users
router.get('/zendesk_users', permissionMiddlewareCreator.list(), (request, response, next) => {
  getUsers(request, response, next);
});

// Get a Zendesk Users
router.get('/zendesk_users/:userId', permissionMiddlewareCreator.details(), (request, response, next) => {
  getUser(request, response, next);

});

module.exports = router;
