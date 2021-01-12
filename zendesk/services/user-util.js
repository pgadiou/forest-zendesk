"use strict";

const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class UserUtil {
  constructor(apiKey) {
    this.apiKey = apiKey;
  } 
  
  getToken (email) {
    return Buffer.from(`${email}/token:${this.apiKey}`).toString('base64');
  };

  async findByEmail(email, currentUser) {

    if (!email || !currentUser || !currentUser.email) return null;
    return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/search.json`, {
      headers: {
        'Authorization': `Basic ${this.getToken(currentUser.email)}` 
      },
      params: {
        query: `type:user user:${email}`,
      }
    }).then(response => {
      //console.log(response);
      return response.data.results[0];    
    })
    // .catch(error => {
    //   console.log(error)
    // });
  }
}

module.exports = UserUtil;
