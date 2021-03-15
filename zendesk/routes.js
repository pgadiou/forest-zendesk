"use strict";
/* eslint-disable no-undef */

module.exports = function Routes(app, model, Implementation, opts) {

  var actionChangeTicketPriority = function (request, response, next) {
    const values = request.body.data.attributes.values;
    new TicketUpdater(Implementation, _.extend(request.body, request.params), request.user, opts, integrationInfo)
    .update({
      priority: values[constants.ZENDESK_ACTION_FORM_CHANGE_TICKET_PRIORITY],
    })
    // eslint-disable-next-line no-unused-vars
    .then(async function (record) {
      response.send({
//        success: '',
        refresh: { relationships: [constants.ZENDESK_TICKET_COMMENTS_RELATIONSHIP] },
      });
    })["catch"](next);
  };


  app.post(`/forest/actions/zendesk-ticket-*/hooks/load`, auth.ensureAuthenticated, performActionTicketHookLoad);

  // eslint-disable-next-line no-unused-vars
  var performActionTicketHookLoad = function (request, response, next) {
    const recordId = request.body.recordIds[0]; 
    new TicketGetter(Implementation, _.extend({ticketId: recordId}), request.user, opts, integrationInfo).perform()
    .then((record) => {
      let schema =  Implementation.Schemas.schemas[request.body.collectionName];
      let action = schema.actions.filter (a => request.url.startsWith(a.endpoint))[0];
      if (action && action.hooks && action.hooks.change) {
        let result = action.hooks.load({fields: _.keyBy(action.fields, 'field'), record, user: request.user});
        response.send({fields: _.values(result)});  
      }  
    })

  }

};