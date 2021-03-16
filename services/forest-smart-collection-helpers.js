/* eslint-disable no-undef */
"use strict";
const Liana = require('forest-express-sequelize');

function getToken () {
  const authEmail = process.env.ZENDESK_AUTH_EMAIL;
  const apiKey = process.env.ZENDESK_API_TOKEN;
  return Buffer.from(`${authEmail}/token:${apiKey}`).toString('base64');
}

function getFilterConditons(params) {

  let filters = [];
  if (params.filters) {
    let filtersJson = JSON.parse(params.filters)
    if (filtersJson.aggregator) {
      filters = filtersJson.conditions;
    }
    else {
      filters = [filtersJson];
    }
  }  

  let filterConditions = [];
  if (params.search) {
    filterConditions.push(params.search)
  }
  for (let filter of filters) {
    // Trick to use fake fields for filtering field (API requirements)
    filter.field = filter.field.replace('_filtering_only',''); 

    if (filter.field==='id') {
      filterConditions.push(`${filter.value}`);
    }
    else {
      // This example shows the equals, greater than and lower than conditions
      // cf. Search operators => https://support.zendesk.com/hc/en-us/articles/203663226-Zendesk-Support-search-reference#topic_lhr_wsc_3v
      let operator = ':';
      switch (filter.operator) {
        case 'before':
          operator = '<';
          break;
        case 'after':
          operator = '>';
          break;
      }
      filterConditions.push(`${filter.field}${operator}${filter.value}`);
    }
  }
  return filterConditions;
}

function getSort(params, options) {
  let sort_by = options.default_sort_by || '';
  let sort_order = options.default_sort_order || '';

  let sort = params.sort;
  if (sort) {
    let asc = true;
    if (sort.startsWith('-')) {
      asc = false;
      sort = sort.substring(1);
    }
    
    const collectionName = options.collection_name;
    const authorized_fields = Liana.Schemas.schemas[collectionName].fields
                                  .filter(field=>field.isSortable)
                                  .map(field=> field.field);

    if (authorized_fields.includes(sort)) {
      sort_by = sort;
      sort_order = asc?'asc':'desc';
    }
  }
  return {sort_by, sort_order};
}


module.exports = {
  getToken,
  getFilterConditons, 
  getSort,
};
