/* eslint-disable no-undef */
const express = require('express');
const { PermissionMiddlewareCreator, RecordGetter, RecordsGetter } = require('forest-express-sequelize');
const { users } = require('../models');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('users');


// This file contains the logic of every route in Forest Admin for the collection users:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a User
router.post('/users', permissionMiddlewareCreator.create(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  next();
});

// Update a User
router.put('/users/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a User
router.delete('/users/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of Users
router.get('/users', permissionMiddlewareCreator.list(), (request, response, next) => {
  const currentUser = request.user;

  const recordsGetter = new RecordsGetter(users);
  recordsGetter.getAll(request.query)
  .then(records => {
    for (const record of records) {
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
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of Users
router.delete('/users', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

module.exports = router;
