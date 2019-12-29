//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// Application wide constants
//
const AppConstants = {
  POPUPS : {
    CREATE_SC: 'create_sc', // Create Service Chain
    UPDATE_SC: 'update_sc', // Update Service Chain
    DELETE_SC: 'delete_sc' // Delete Service Chain
  },

  APIS: {
    GROUPS_API : '/api/nutanix/v3/groups'
  },

  // State for when an action is enabled
  ACTION_CAPABILITY_ENABLED_STATE: { state: 'enabled' },

  // SChain Modes
  SC_TYPE: {
    INLINE: 'INLINE',
    TAP: 'TAP'
  },

  // Polling Freq for the grid
  POLLING_FREQ_SECS: 90,

  // The Obelix.1 release version
  PC_OBELIX_1_VERSION: '5.6',

  // Name of the services.
  SERVICE_NAME: {
    PRISM_UI: 'prismui'
  },


  // Target and State for Header IFrame dom click listener
  IFRAME_EVENT_OPEN_PE: 'iframe_event_open_pe',
  FS_PC_TO_PE: 'fs_pc_to_pe',

  ENTITY_TYPES: {
    // MH_VM: 'vm',
    // SERVICE_CHAIN: 'network_function_chain',
    // CLUSTER: 'cluster',
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

  ENTITY_CATEGORY_SEPARATOR: ':',
  CATEGORY : {
    NET_SERVICE_PROVIDER: 'NetworkServiceProvider'
    // NET_SERVICE_PROVIDER: 'network_function_provider'
  }
};

export default AppConstants;
