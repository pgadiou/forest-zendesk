"use strict";

const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class SmartActions {
  constructor(apiKey) {
    this.apiKey = apiKey;
  } 
  
  getToken (email) {
    return Buffer.from(`${email}/token:${this.apiKey}`).toString('base64');
  };

  async addComment(request, response, next) {

    if (!email || !currentUser || !currentUser.email) return null;
    const ticketId = 2;
    const body = "test";
   const data = {
      comment: {
        body,
        public: true,
      }
    };
    return axios.put(
      `${ZENDESK_URL_PREFIX}/api/v2/tickets/${ticketId}`, 
      data, 
      {
        headers: {
          'Authorization': `Basic ${this.getToken(currentUser.email)}`,
          'Content-Type': 'application/json',
        },
      }
    ).then(response => {
      //console.log(response);
      return response.data.results[0];    
    })
    // .catch(error => {
    //   console.log(error)
    // });
  }
}

module.exports = SmartActions;
