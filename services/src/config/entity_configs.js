//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The EB configuration for Minerva Files view
//
import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue) => i18n.getInstance().t(
  'EntityConfigs', key, defaultValue);

const entity_configs = {
  file_server_service: {
    schema: {
      idAttribute: 'entity_id',
      nameAttribute: 'name',
      attributes: {
        name: {
          type: 'string',
          displayName: i18nT('schema.file_server.name', 'Name')
        },
        nvm_uuid_list: {
          type: 'string',
          displayName: i18nT('schema.file_server.file_server_vms', 'File Server Vms')
        },
        cluster: {
          type: 'string',
          displayName: i18nT('schema.file_server.cluster', 'Cluster')
        },
        afs_version : {
          type: 'string',
          displayName: i18nT('schema.file_server.versions', 'Versions')
        },
        cluster_uuid : {
          type: 'string',
          displayName: i18nT('schema.file_server.actions', 'Actions')
        }
      }
    },
    perspectives: [
      {
        name: '_common_',
        entityAttributes: {
          idAttribute: 'entity_id',
          primaryAttribute: 'name',
          customRenders: {
            name : {
              columnWidth: '25%',
              formatter: 'fs_name'
            },
            cluster : {
              columnWidth: '15%'
            },
            nvm_uuid_list: {
              columnWidth: '20%',
              formatter: 'number_of_vms'
            },
            afs_version : {
              columnWidth: '15%',
              formatter: 'version'
            },
            cluster_uuid: {
              columnWidth: '15%',
              formatter: 'actions'
            }
          },
          groupByAttributes: [
            'name', 'afs_version'
          ],
          helperAttributes: [
            'nvm_uuid_list'
          ],
          virtualAttributes: [
            'network_function_type',
            'network_function_categories'
          ],
          filterByAttributes: [
            'name'
          ]
        },
        visualizations: [
          {
            name: 'grid',
            entityAttributes: {}
          }
        ]
      },
      {
        name: 'General',
        entityAttributes: {
          idAttribute: 'entity_id',
          primaryAttribute: 'name',
          displayAttributes: [
            'name',
            'cluster',
            'nvm_uuid_list',
            'afs_version',
            'cluster_uuid'
          ],
          sortByAttributes: [
            'name'
          ],
          groupByAttributes: [],
          colorByAttributes: [],
          helperAttributes: [],
          summaries: {}
        }
      }
    ],
    actions: {},
    details: [],
    filters: {},
    gettingStarted: {
      createActionId: 'create_sc',
      gettingStartedPrompt: i18nT('noFiles',
        'Minerva files have not been defined. Start by defining one.')
    }
  },
  event: {
    schema: {
      idAttribute: 'entity_id',
      nameAttribute: 'name',
      attributes: {
        name: {
          type: 'string',
          displayName: i18nT('schema.file_server.name', 'Name')
        },
        file_server_vms: {
          type: 'string',
          displayName: i18nT('schema.file_server.file_server_vms', 'File Server Vms')
        },
        cluster: {
          type: 'string',
          displayName: i18nT('schema.file_server.cluster', 'Cluster')
        },
        // Virtual Attribute
        versions : {
          type: 'string',
          displayName: i18nT('schema.file_server.versions', 'Versions')
        },
        // Virtual Attribute
        network_function_categories : {
          type: 'string',
          isList: true,
          displayName: i18nT('schema.file_server.networkServiceProviders',
            'Network Service Providers')
        },
        // Joined Attribute
        policies : {
          type: 'string',
          isList: true,
          displayName: i18nT('schema.file_server.policies', 'Polices')
        }
      }
    },
    perspectives: [
      {
        name: '_common_',
        entityAttributes: {
          idAttribute: 'entity_id',
          primaryAttribute: 'name',
          customRenders: {
            name : {
              columnWidth: '25%'
            },
            cluster : {
              columnWidth: '15%'
            },
            file_server_vms: {
              columnWidth: '20%'
            },
            versions : {
              columnWidth: '15%'
            }
          },
          groupByAttributes: [
          ],
          helperAttributes: [
            'network_function_list'
          ],
          virtualAttributes: [
            'network_function_type',
            'network_function_categories'
          ],
          filterByAttributes: [
            'name'
          ]
        },
        visualizations: [
          {
            name: 'grid',
            entityAttributes: {}
          }
        ]
      },
      {
        name: 'General',
        entityAttributes: {
          idAttribute: 'entity_id',
          primaryAttribute: 'name',
          displayAttributes: [
            'name',
            'cluster',
            'file_server_vms',
            'versions'
          ],
          sortByAttributes: [
            'name'
          ],
          groupByAttributes: ['cluster'],
          colorByAttributes: [],
          helperAttributes: [],
          summaries: {}
        }
      }
    ],
    actions: {},
    details: [],
    filters: {},
    gettingStarted: {
      createActionId: 'create_sc',
      gettingStartedPrompt: i18nT('noFiles',
        'Minerva files have not been defined. Start by defining one.')
    }
  },
  alert: {
    schema: {
      idAttribute: 'entity_id',
      nameAttribute: 'name',
      attributes: {
        name: {
          type: 'string',
          displayName: i18nT('schema.file_server.name', 'Name')
        },
        file_server_vms: {
          type: 'string',
          displayName: i18nT('schema.file_server.file_server_vms', 'File Server Vms')
        },
        cluster: {
          type: 'string',
          displayName: i18nT('schema.file_server.cluster', 'Cluster')
        },
        // Virtual Attribute
        versions : {
          type: 'string',
          displayName: i18nT('schema.file_server.versions', 'Versions')
        },
        // Virtual Attribute
        network_function_categories : {
          type: 'string',
          isList: true,
          displayName: i18nT('schema.file_server.networkServiceProviders',
            'Network Service Providers')
        },
        // Joined Attribute
        policies : {
          type: 'string',
          isList: true,
          displayName: i18nT('schema.file_server.policies', 'Polices')
        }
      }
    },
    perspectives: [
      {
        name: '_common_',
        entityAttributes: {
          idAttribute: 'entity_id',
          primaryAttribute: 'name',
          customRenders: {
            name : {
              columnWidth: '25%'
            },
            cluster : {
              columnWidth: '15%'
            },
            file_server_vms: {
              columnWidth: '20%'
            },
            versions : {
              columnWidth: '15%'
            }
          },
          groupByAttributes: [
          ],
          helperAttributes: [
            'network_function_list'
          ],
          virtualAttributes: [
            'network_function_type',
            'network_function_categories'
          ],
          filterByAttributes: [
            'name'
          ]
        },
        visualizations: [
          {
            name: 'grid',
            entityAttributes: {}
          }
        ]
      },
      {
        name: 'General',
        entityAttributes: {
          idAttribute: 'entity_id',
          primaryAttribute: 'name',
          displayAttributes: [
            'name',
            'cluster',
            'file_server_vms',
            'versions'
          ],
          sortByAttributes: [
            'name'
          ],
          groupByAttributes: ['cluster'],
          colorByAttributes: [],
          helperAttributes: [],
          summaries: {}
        }
      }
    ],
    actions: {},
    details: [],
    filters: {},
    gettingStarted: {
      createActionId: 'create_sc',
      gettingStartedPrompt: i18nT('noFiles',
        'Minerva files have not been defined. Start by defining one.')
    }
  }
};

export default entity_configs;
