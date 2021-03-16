/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('zendesk_groups');

const {getGroups, getGroup} = require('../services/zendesk-groups-service');

// Get a list of Zendesk Groups
router.get('/zendesk_groups', permissionMiddlewareCreator.list(), (request, response, next) => {
  getGroups(request, response, next);
});

// Get a Zendesk Group
router.get('/zendesk_groups/:groupId', permissionMiddlewareCreator.details(), (request, response, next) => {
  getGroup(request, response, next);
});

module.exports = router;
