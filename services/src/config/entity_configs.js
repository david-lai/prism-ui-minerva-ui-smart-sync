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
          displayName: i18nT('schema.file_server.file_server_vms', 'File Server VMs')
        },
        cluster_name: {
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
          groupByAttributes: [],
          helperAttributes: [
          ],
          virtualAttributes: [
            'network_function_type',
            'network_function_categories'
          ],
          filterByAttributes: [
            'name',
            'afs_version'
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
            'cluster_name',
            'nvm_uuid_list',
            'afs_version',
            'cluster_uuid'
          ],
          sortByAttributes: [
            'name'
          ],
          groupByAttributes: [
            'cluster_name',
            'afs_version'
          ],
          colorByAttributes: [],
          helperAttributes: [],
          summaries: {}
        }
      }
    ],
    actions: {},
    details: [],
    filters: {}
    // Temporary Comment out. UmComment it when PC add FS workflow is
    // supported
    // gettingStarted: {
    //   createActionId: 'create_sc',
    //   gettingStartedPrompt: i18nT('noFiles',
    //     'Minerva files have not been defined. Start by defining one.')
    // }
  },
  event: {
    schema: {
      idAttribute: 'entity_id',
      nameAttribute: 'title',
      attributes: {
        default_message: {
          type: 'string',
          select: true,
          displayName: i18nT('schema.event.description', 'Description')
        },
        param_name_list: {
          type: 'string',
          isList: true
        },
        param_value_list: {
          type: 'string',
          isList: true,
          displayName: i18nT('schema.event.sourceEntity', 'Source Entity')
        },
        classification: {
          type: 'enum',
          subType: 'string',
          isList: true,
          displayName: i18nT('schema.event.classification', 'Event Type'),
          sortable : false,
          values : {
            Anomaly: 'Behavioral Anomaly',
            SystemAction: 'System Action',
            UserAction: 'User Action'
          }
        },
        // Virtual Attribute
        cluster_name : {
          type: 'string',
          displayName: i18nT('schema.event.cluster', 'Cluster')
        },
        _created_timestamp_usecs_ : {
          type: 'integer',
          displayName: i18nT('schema.event.createdTime', 'Create Time')
        }
      }
    },
    perspectives: [
      {
        name: '_common_',
        entityAttributes: {
          idAttribute: 'entity_id',
          primaryAttribute: '_created_timestamp_usecs_',
          customRenders: {
            default_message : {
              formatter: 'event_description',
              columnWidth: '30%'
            },
            param_value_list: {
              columnWidth: '15%',
              formatter: 'pick_named_list_item',
              formatterOptions: {
                nameListProp: 'param_name_list',
                valueName: 'file_server_name'
              }
            },
            classification: {
              formatter: 'join_pascal_case_array',
              formatterOptions: {
                delimiter: ', '
              },
              columnWidth: '15%'
            },
            cluster_name : {
              columnWidth: '20%'
            },
            _created_timestamp_usecs_: {
              formatter: 'timestampformatterUSec',
              columnWidth: '20%'
            }
          },
          groupByAttributes: [
          ],
          helperAttributes: [
          ],
          virtualAttributes: [
          ],
          filterByAttributes: [
            'classification'
          ],
          defaultSortingAttribute: '_created_timestamp_usecs_'
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
          primaryAttribute: '_created_timestamp_usecs_',
          displayAttributes: [
            'default_message',
            'param_value_list',
            'classification',
            'cluster_name',
            '_created_timestamp_usecs_'
          ],
          sortByAttributes: [
            '_created_timestamp_usecs_'
          ],
          groupByAttributes: [],
          colorByAttributes: [],
          helperAttributes: [
            'param_name_list'
          ],
          summaries: {}
        }
      }
    ],
    actions: {},
    details: [],
    filters: {
    },
    gettingStarted: {
    }
  },
  alert: {
    schema: {
      idAttribute: 'entity_id',
      nameAttribute: 'title',
      attributes: {
        title: {
          type: 'string',
          select: true,
          displayName: i18nT('schema.alert.description', 'Description')
        },
        param_value_list: {
          type: 'string',
          isList: true,
          displayName: i18nT('schema.alert.sourceEntity', 'Source Entity')
        },
        param_name_list: {
          type: 'string',
          isList: true
        },
        impact_type: {
          type: 'enum',
          subType: 'string',
          displayName: i18nT('schema.alert.impactType', 'Impact Type'),
          values: {
            Availability: i18nT('schema.alert.availability', 'Availability'),
            Capacity: i18nT('schema.alert.capacity', 'Capacity'),
            Configuration: i18nT('schema.alert.configuration', 'Configuration'),
            Performance: i18nT('schema.alert.performance', 'Performance'),
            SystemIndicator: i18nT('schema.alert.system_indicator', 'System Indicator'),
            ControllerVM: i18nT('schema.alert.controller_vm', 'Controller VM')
          }
        },
        severity : {
          type: 'enum',
          subType: 'string',
          displayName: i18nT('schema.alert.severity', 'Severity'),
          values: {
            critical: i18nT('schema.alert.critical', 'Critical'),
            warning: i18nT('schema.alert.warning', 'Warning'),
            info : i18nT('schema.alert.info', 'Info')
          }
        },
        resolved: {
          type: 'boolean',
          displayName: i18nT('schema.alert.resolved', 'Resolved')
        },
        acknowledged: {
          type: 'boolean',
          displayName: i18nT('schema.alert.acknowledged', 'Acknowledged')
        },
        _created_timestamp_usecs_ : {
          type: 'integer',
          displayName: i18nT('schema.alert.createdTime', 'Create Time')
        },
        _cluster_uuid_: {
          type: 'string'
        },
        cluster_name: {
          type: 'string',
          displayName: i18nT('schema.alert.cluster', 'Cluster')
        }
      }
    },
    perspectives: [
      {
        name: '_common_',
        entityAttributes: {
          idAttribute: 'entity_id',
          primaryAttribute: '_created_timestamp_usecs_',
          customRenders: {
            title : {
              formatter: 'alert_title',
              columnWidth: '25%'
            },
            param_value_list: {
              columnWidth: '15%',
              formatter: 'pick_named_list_item',
              formatterOptions: {
                nameListProp: 'param_name_list',
                valueName: 'file_server_name'
              }
            },
            impact_type: {
              formatter: 'separate_pascal_case',
              columnWidth: '15%'
            },
            severity: {
              formatter: 'alert_severity',
              columnWidth: '10%'
            },
            _created_timestamp_usecs_: {
              formatter: 'timestampformatterUSec',
              columnWidth: '15%'
            },
            cluster_name : {
              columnWidth: '20%'
            }
          },
          groupByAttributes: [
          ],
          helperAttributes: [
          ],
          virtualAttributes: [
          ],
          filterByAttributes: [
            'severity',
            'impact_type'
          ],
          defaultSortingAttribute: '_created_timestamp_usecs_'
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
          primaryAttribute: '_created_timestamp_usecs_',
          displayAttributes: [
            'title',
            'param_value_list',
            'impact_type',
            'severity',
            '_created_timestamp_usecs_',
            'cluster_name'
          ],
          sortByAttributes: [
            '_created_timestamp_usecs_'
          ],
          sortByOrder: 'DESCENDING',
          groupByAttributes: [],
          colorByAttributes: [],
          helperAttributes: [
            'param_name_list'
          ],
          summaries: {}
        }
      }
    ],
    actions: {},
    details: [],
    filters: {
    },
    gettingStarted: {
    }
  }
};

export default entity_configs;
