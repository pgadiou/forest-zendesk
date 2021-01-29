"use strict";

module.exports = {
  ZENDESK_USERS: 'zendesk_users',
  ZENDESK_TICKETS: 'zendesk_tickets',
  ZENDESK_REQUESTED_TICKETS: 'ze_requested_tickets',
  ZENDESK_GROUPS: 'zendesk_groups',
  ZENDESK_ORGANIZATIONS: 'zendesk_organizations',
  ZENDESK_TICKETS_COMMENTS: 'zendesk_tickets_comments',
  ZENDESK_TICKET_COMMENTS_RELATIONSHIP: 'ze_tickets_comments',
  ZENDESK_TICKETS_STATUS_ENUM: ["new", "open", "pending", "hold", "solved", "closed"],
  ZENDESK_TICKETS_PRIORITY_ENUM: ["urgent", "high", "normal", "low"],
  ZENDESK_USER_GROUPS: 'ze_user_groups',
  ZENDESK_USER_ORGANIZATIONS: 'ze_user_organizations',
  ZENDESK_ACTION_ENDPOINT_ADD_COMMENT: '/forest/actions/zendesk-add-comment',
  ZENDESK_ACTION_FORM_ADD_COMMENT_CONTENT: 'Content',
  ZENDESK_ACTION_FORM_ADD_COMMENT_PUBLIC: 'Public',
  ZENDESK_ACTION_ENDPOINT_CHANGE_TICKET_PRIORITY: '/forest/actions/zendesk-change-ticket-priority',
  ZENDESK_ACTION_FORM_CHANGE_TICKET_PRIORITY: 'New Ticket Priority',
};