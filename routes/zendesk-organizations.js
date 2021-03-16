/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-sequelize');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('zendesk_groups');

const {getOrganizations, getOrganization} = require('../services/zendesk-organizations-service');

// Get a list of Zendesk Groups
router.get('/zendesk_organizations', permissionMiddlewareCreator.list(), (request, response, next) => {
  getOrganizations(request, response, next);
});

// Get a Zendesk Group
router.get('/zendesk_organizations/:organizationId', permissionMiddlewareCreator.details(), (request, response, next) => {
  getOrganization(request, response, next);
});

module.exports = router;
