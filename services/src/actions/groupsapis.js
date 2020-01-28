//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Actions
//

import axios from 'axios';
import AppConstants from './../utils/AppConstants';
import AppUtil from './../utils/AppUtil';

// ------------
// Action Types
// ------------
export const FETCH_FS = 'FETCH_FS';
export const FETCH_ALERTS = 'FETCH_ALERTS';

/**
 * Fetches alerts data from the API
 *
 * @param  {Array}   entityIds      IDs of file servers to fetch alerts for (optional)
 * @param  {Boolean} unresolvedOnly Flag to indicate whether to return only resolved alerts (default: true
 * )
 * @return {Function}               Dispatcher method
 */
export const fetchAlerts = (entityIds = [], unresolvedOnly = true) => {
  return async(dispatch) => {
    let filter_criteria = 'file_server!=[no_val]';
    if (Array.isArray(entityIds) && entityIds.length) {
      filter_criteria = `file_server=in=${entityIds.join(',')}`;
    }
    if (unresolvedOnly) {
      filter_criteria += ';resolved==false';
    }
    const query = {
      entity_type: 'alert',
      group_member_offset: 0,
      group_member_sort_attribute: '_created_timestamp_usecs_',
      group_member_sort_order: 'DESCENDING',
      group_member_attributes: [
        {
          attribute: 'title'
        },
        {
          attribute: 'source_entity_name'
        },
        {
          attribute: 'impact_type'
        },
        {
          attribute: 'severity'
        },
        {
          attribute: 'resolved'
        },
        {
          attribute: 'acknowledged'
        },
        {
          attribute: '_created_timestamp_usecs_'
        },
        {
          attribute: 'cluster'
        },
        {
          attribute: 'default_message'
        },
        {
          attribute: 'param_name_list'
        },
        {
          attribute: 'param_value_list'
        },
        {
          attribute: 'auto_resolved'
        },
        {
          attribute: 'acknowledging_user'
        },
        {
          attribute: 'acknowledged_timestamp_usecs'
        },
        {
          attribute: 'resolving_user'
        },
        {
          attribute: 'resolved_timestamp_usecs'
        },
        {
          attribute: 'source_entity_uuid'
        },
        {
          attribute: 'source_entity_type'
        }
      ],
      filter_criteria
    };
    let alertsData = null;
    try {
      const resp = await axios.post(AppConstants.APIS.GROUPS_API, query);
      if (resp && resp.data) {
        alertsData = resp.data;
      } else {
        alertsData = false;
      }
    } catch (ex) {
      alertsData = false;
    }
    dispatch({
      type: FETCH_ALERTS,
      payload: alertsData
    });
  };
};


export const fetchFsData = (includeAlerts = false, unresolvedAlertsOnly = true) => {
  return async(dispatch) => {
    const query = {
      entity_type: 'file_server_service',
      group_member_sort_attribute: 'name',
      group_member_sort_order: 'ASCENDING',
      group_member_offset: 0,
      group_member_attributes: [
        {
          attribute: 'name'
        },
        {
          attribute: 'cluster'
        },
        {
          attribute: 'nvm_uuid_list'
        },
        {
          attribute: 'afs_version'
        },
        {
          attribute: 'cluster_uuid'
        }
      ]
    };
    const resp = await axios.post(AppConstants.APIS.GROUPS_API, query);
    if (resp && resp.data && includeAlerts) {
      const data = await AppUtil.populateServersAlertData(resp.data, unresolvedAlertsOnly);
      dispatch({
        type: FETCH_FS,
        payload: data
      });
    } else {
      dispatch({
        type: FETCH_FS,
        payload: resp.data
      });
    }
  };
};

