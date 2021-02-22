/* eslint-disable no-undef */
const chalk = require('chalk');
const path = require('path');
const Liana = require('forest-express-sequelize');
const { sequelize } = require('../models');
const zendesk = require('../zendesk');

var ConfigStore = require('forest-express/dist/services/config-store');

module.exports = async function forestadmin(app) {

  app.use(await Liana.init({
    modelsDir: path.join(__dirname, '../models'),
    configDir: path.join(__dirname, '../forest'),
    envSecret: process.env.FOREST_ENV_SECRET,
    authSecret: process.env.FOREST_AUTH_SECRET,
    sequelize,
  }));

  // Zendesk Module configuration
  var configStore = ConfigStore.getInstance();
  var client = new zendesk({
    mapping: 'users.email', 
    apiKey: process.env.ZENDESK_API_TOKEN,
    /** Authentication parameters:
           - serviceAccount => user for Zendesk Auth = serviceAccount,
           - otherwise => user for Zendesk Auth = user connected to forest (cf. currentUser)
    **/
    authMethod: 'serviceAccount', 
    serviceAccount: process.env.ZENDESK_SERVICE_ACCOUNT, // 
  }, configStore.Implementation, app);
  configStore.zendesk = client;
  
  console.log(chalk.cyan('Your admin panel is available here: https://app.forestadmin.com/projects'));
};
