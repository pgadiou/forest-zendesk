"use strict";

const AbstractGetter = require("./abstract-getter");

class AbstractRecordsGetter extends AbstractGetter {

  perform () {
    const collectionModel = this.integrationInfo.collection;
    const collectionFieldName = this.integrationInfo.field;
    const embeddedPath = this.integrationInfo.embeddedPath;
    const fieldName = embeddedPath ? "".concat(collectionFieldName, ".").concat(embeddedPath) : collectionFieldName;
    const that = this;
    return this.Implementation.Stripe.getCustomer(collectionModel, collectionFieldName, this.params.recordId).then(function (customer) {
      return that.getRecords()
      .then( (response) => {
        let count = response.data.count;
        console.log(response);
        return [count, response.data.results];
      });
    });
  }    
  
  getRecords () {
    throw new Error('You have to implement the method getRecords!');
  };

}

module.exports = AbstractRecordsGetter;
