"use strict";
/* eslint-disable no-undef */

const axios = require('axios');
const ZENDESK_URL_PREFIX = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com`;

class UserUtil {
  constructor(opts) {
    this.opts = opts;
  } 
  
  getToken (email) {
    return Buffer.from(`${email}/token:${this.opts.apiKey}`).toString('base64');
  }

  async findByEmail(email, currentUser) {

    if (this.opts.authMethod !== 'serviceAccount') {
      if (!email || !currentUser || !currentUser.email) return null;
    }
    
    const authEmail = this.opts.authMethod === 'serviceAccount' ? this.opts.serviceAccount : this.user.email;
    return axios.get(`${ZENDESK_URL_PREFIX}/api/v2/search.json`, {
      headers: {
        'Authorization': `Basic ${this.getToken(authEmail)}` 
      },
      params: {
        query: `type:user user:${email}`,
      }
    }).then(response => {
      return response.data.results[0];    
    })
  }
}

module.exports = UserUtil;
