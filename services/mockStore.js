import fsData from './mockserver/mock_data/groups_file_servers.json';
import alertsData from './mockserver/mock_data/groups_alerts.json';

export default {
	modals:{
	    visible: true,
	    options: {},
	    type: ''
    },
    groupsapi: {
      fsData,
      alertsData,
      summaryAlerts: alertsData,
      alertsWidgetRange: 'day',
      alertModalLoading: false,
      alertRequestActive: false,
      alertRequestType: '',
      alertRequestStatus: true,
      alertInfo: {
	    entity: {
	      last_update_time: '2020-03-03T17:26:09Z',
	      source_entity: {},
	      affected_entity_list: [],
	      severity: 'warning',
	      title: 'File Server User Management Configuration Failed',
	      default_message: 'The values provided for File server {file_server_name}\'s user management options are incorrect.',
	      creation_time: '2020-02-11T00:47:20Z',
	      resolution_status: {
	        is_true: false
	      },
	      indicator_list: [],
	      acknowledged_status: {
	        is_true: false
	      },
	      is_user_defined: false,
	      severity_trail_list: [
	      {
	        severity_change_time: '2020-02-11T00:47:20Z',
	        severity: 'warning'
	      }
	      ],
	      classification_list: [
	        'NutanixFiles'
	      ],
	      possible_cause_list: [
	      {
	        resolution_list: [
	        'Please check and try again with correct entries for various fields in the user management tab.'
	        ],
	        cause_list: [
	        'Failed to configure user management with given options'
	        ]
	      }
	      ],
	      impact_type_list: [
	        'Configuration'
	      ],
	      parameters: {
	        nos_version: {
	          string_value: '5.17'
	        },
	        arithmos_id: {
	          string_value: 'ffb63302-585a-48b2-a07c-c82eaa8f7252'
	        },
	        file_server_uuid: {
	          string_value: 'ffb63302-585a-48b2-a07c-c82eaa8f7252'
	        },
	        reason: {
	          string_value: 'User credentials failed with error -  Authentication failed: Invalid credentials.'
	        },
	        file_server_name: {
	          string_value: 'File-App01'
	        },
	        ncc_version: {
	          string_value: '3.10.0-7f482156'
	        }
	      },
	      type: 'A160050',
	      latest_occurrence_time: '2020-02-11T00:47:20Z',
	      entityId: 'testId'
	    }
	  }
    },
    tabs: {
      tabIndex: 0,
    }
};
