/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator, RecordGetter, RecordsGetter } = require('forest-express-sequelize');
const { users } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('users');

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
  const currentUser = request.user;

  const recordsGetter = new RecordsGetter(users);
  recordsGetter.getAll(request.query)
  .then(records => {
    for (const record of records) {
    // Add the currentUser in the record Context
    record.currentUser = currentUser;
    }
    return recordsGetter.serialize(records);
   })
  .then(recordsSerialized => response.send(recordsSerialized))
  .catch(next);
});

// Get a number of Users
router.get('/users/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  next();
});

// Get a User
router.get('/users/:recordId', permissionMiddlewareCreator.details(), (request, response, next) => {
  const currentUser = request.user;

  if (request.params.recordId === 'count') { return next(); }
  const recordGetter = new RecordGetter(users);
  recordGetter.get(request.params.recordId)
  .then(record => {
    // Add the currentUser in the record Context
    record.currentUser = currentUser;
    return recordGetter.serialize(record);
   })
  .then(recordSerialized => {
    response.send(recordSerialized)
  })
  .catch(next);
});

// Export a list of Users
router.get('/users.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  next();
});

// Delete a list of Users
router.delete('/users', permissionMiddlewareCreator.delete(), (request, response, next) => {
  next();
});

module.exports = router;
