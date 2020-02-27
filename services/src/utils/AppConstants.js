//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// Application wide constants
//
const AppConstants = {
  APIS: {
    GROUPS_API : '/api/nutanix/v3/groups'
  },

  // State for when an action is enabled
  ACTION_CAPABILITY_ENABLED_STATE: { state: 'enabled' },

  // Polling Freq for the grid
  POLLING_FREQ_SECS: 90,

  // Name of the services.
  SERVICE_NAME: {
    PRISM_UI: 'prismui'
  },

  SUMMARY_TAB_KEY: 'summary',
  FILE_SERVERS_TAB_KEY: 'file_servers',
  ALERTS_TAB_KEY: 'alerts',
  EVENTS_TAB_KEY: 'events',

  // Target and State for Header IFrame dom click listener
  IFRAME_EVENT_OPEN_PE: 'iframe_event_open_pe',
  IFRAME_EVENT_CHANGE_PC_URL: 'iframe_event_change_pc_url',
  IFRAME_EVENT_REQUEST_PC_URL: 'iframe_event_request_pc_url',
  IFRAME_EVENT_CURRENT_PC_URL: 'iframe_event_current_pc_url',
  FS_PC_TO_PE: 'fs_pc_to_pe',
  FS_CHANGE_PC_URL: 'fs_change_pc_url',
  FS_REQUEST_PC_URL: 'fs_request_pc_url',
  FS_CURRENT_PC_URL: 'fs_current_pc_url',
  FS_PC_URL_LISTENER: 'fs_pc_url_listener',

  ENTITY_TYPES: {
    ENTITY_FILE_SERVER: 'file_server_service',
    ENTITY_ALERT      : 'alert',
    ENTITY_EVENT      : 'event'
  },

  ENTITY_TYPE_NAME: {
    ENTITY_FILE_SERVER: 'File Server',
    ENTITY_ALERT      : 'Alert',
    ENTITY_EVENT      : 'Event'
  },

  ENTITY_TYPE_NAME_PLURAL: {
    ENTITY_FILE_SERVER: 'File Servers',
    ENTITY_ALERT      : 'Alerts',
    ENTITY_EVENT      : 'Events'
  },

  // NOTIFICATION
  //-------------
  NOTIFY_SUCCESS : 'notifySuccess',
  NOTIFY_ERROR : 'notifyError',

  METHODS: {
    GET: 'GET',
    PUT: 'PUT'
  },

  MODAL_TYPE: {
    FILE_SERVER_DETAILS: 'file_server_details',
    ALERT_INFO: 'alert_info'
  },

  ENTITY_CATEGORY_SEPARATOR: ':',
  CATEGORY : {
    NET_SERVICE_PROVIDER: 'NetworkServiceProvider'
  },


  // Action Types
  ACTIONS: {
    FETCH_FS: 'fetch_fs',
    HIGHLIGHTED_WIDGET_BUSY: 'highlighted_widget_busy',
    FETCH_ALERTS: 'fetch_alerts',
    SUMMARY_ALERTS_BUSY: 'summary_alerts_busy',
    FETCH_SUMMARY_ALERTS: 'fetch_summary_alerts',
    FETCH_SERVER_ALERTS: 'fetch_server_alerts',
    SET_ALERTS_WIDGET_RANGE: 'set_alerts_widget_range',

    SET_TAB: 'set_tab'
  }
};

export default AppConstants;
