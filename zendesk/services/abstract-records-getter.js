"use strict";
/* eslint-disable no-undef */

const AbstractGetter = require("./abstract-getter");

const Liana = require('forest-express');

class AbstractRecordsGetter extends AbstractGetter {

  perform () {
    return this.getRecords()
  }    
  
  getRecords () {
    throw new Error('You have to implement the method getRecords!');
  }

  getFilterConditons(options) {
    const replaceFieldNames = options.replaceFieldNames;

    let filters = [];
    if (this.params.filters) {
      let filtersJson = JSON.parse(this.params.filters)
      if (filtersJson.aggregator) {
        filters = filtersJson.conditions;
      }
      else {
        filters = [filtersJson];
      }
    }  

    let filterConditions = [];
    if (this.params.search) {
      filterConditions.push(this.params.search)
    }
    for (let filter of filters) {
      // Trick to use fake fields for filtering field (API requirements)
      filter.field = filter.field.replace('_filtering_only',''); 

      // Some fields are displayed with a name and filterable with another name
      if (replaceFieldNames[filter.field]) {
        filter.field = replaceFieldNames[filter.field];
      }

      if (filter.field==='id') {
        filterConditions.push(`${filter.value}`);
      }
      else {
        //TODO: support more than that? <= & >= & - (not)
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

  getSort(options) {
    let sort_by = options.default_sort_by || '';
    let sort_order = options.default_sort_order || '';


    let sort = this.params.sort;
    if (sort) {
      let asc = true;
      if (sort.startsWith('-')) {
        asc = false;
        sort = sort.substring(1);
      }

      const authorized_fields = Liana.Schemas.schemas[options.collection_name].fields.filter(field=>field.isSortable).map(field=> field.field);

      if (authorized_fields.includes(sort)) {
        sort_by = sort==='type'?'ticket_type':sort;
        sort_order = asc?'asc':'desc';
      }
    }
    return {sort_by, sort_order};

  }
}

module.exports = AbstractRecordsGetter;
