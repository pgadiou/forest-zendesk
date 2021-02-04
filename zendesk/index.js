"use strict";
/* eslint-disable no-undef */

var _ = require('lodash');
var logger = require('forest-express/dist/services/logger');

var Routes = require('./routes');

// var Setup = require('./setup');

function Checker(opts, Implementation, app) {
  var integrationValid = false;
  this.apiKey = opts.apiKey;

  function hasIntegration() {
    return opts.apiKey;
  }


  function isProperlyIntegrated() {
    if (! (opts.apiKey && opts.mapping) ) return false;
    if (opts.authMethod && (!opts.serviceAccount)) return false;
    return true;
  }

  function castToArray(value) {
    return _.isString(value) ? [value] : value;
  }

  function isMappingValid() {
    return true;
  }

  // function integrationCollectionMatch(integration, model) {
  //   return true;
  // }

  if (hasIntegration()) {
    if (isProperlyIntegrated()) {
      const mapping = opts.mapping.split('.');
      this.mapping = {modelName: mapping[0], fieldName: mapping[1]};
      opts.mapping = castToArray(opts.mapping);
      integrationValid = isMappingValid();
    } else {
      logger.error('Cannot setup properly your Zendesk integration.');
    }
  }

  this.defineRoutes = function (app, model) {
    if (!integrationValid) {
      return;
    }

    // if (integrationCollectionMatch(opts, model)) {
      new Routes(app, model, Implementation, opts).perform();
    // }
  };
 //let usersSchema = Schemas.schemas['users'];
 let usersModel = Implementation.getModels()['users'];

  // this.defineFields(usersModel, usersSchema);
//  Schemas.schemas['users'] = usersSchema;
  
  this.defineRoutes(app, usersModel);

}

module.exports = Checker;

var configStore = require('forest-express/dist/services/config-store').getInstance();
var P = require("bluebird");

const Zendesk = {

  getUserByUserField: function (userFieldName, userFieldValue) {
    const userModelName = configStore.zendesk.mapping.modelName; 
    const userModel = configStore.Implementation.getModels()[userModelName];
    if (!userModel) {
      return new P(function (resolve) {
        return resolve();
      });
    }

    const query = {};
    query[userFieldName] = userFieldValue;
    return userModel.findOne({
      where: query
    }).then(function (user) {
      if (!user) {
        return null;
      }

      return user.toJSON();
    });
  }
};

module.exports.Zendesk = Zendesk;
