"use strict";

const cookieParser = require("cookie-parser");
const AbstractGetter = require("./abstract-getter");

const Liana = require('forest-express');

class AbstractRecordsGetter extends AbstractGetter {

  perform () {
    const collectionModel = this.integrationInfo.collection;
    const collectionFieldName = this.integrationInfo.field;
    //const embeddedPath = this.integrationInfo.embeddedPath;
    //const fieldName = embeddedPath ? "".concat(collectionFieldName, ".").concat(embeddedPath) : collectionFieldName;
    const that = this;
    // if (this.params.recordId) {
    //   return this.Implementation.Stripe.getCustomer(collectionModel, collectionFieldName, this.params.recordId).then(function (customer) {
    //     return that.getRecords(true, customer)
    //     // .then( (response) => {
    //     //   let count = response.data.count;
    //     //   console.log(response);
    //     //   return [count, response.data.results];
    //     // });
    //   });
    // } 
    // else {
      return that.getRecords(false, null)
      // .then( (response) => {
      //   let count = response.data.count;
      //   console.log(response);
      //   return [count, response.data.results];
      // });
    // }
  }    
  
  getRecords () {
    throw new Error('You have to implement the method getRecords!');
  }

  getFilterConditons() {
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
    for (let filter of filters) {
      filter.field = filter.field.replace('_filtering_only',''); // Trick to use fake fields for filtering field (API requirements)
      if (filter.field==='id') {
        filterConditions.push(`${filter.value}`);
      }
      else {
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
