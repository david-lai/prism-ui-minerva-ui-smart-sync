//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Actions
//

import axios from 'axios';
import AppConstants from './../utils/AppConstants';

// ------------
// Action Types
// ------------
export const FETCH_FS = AppConstants.ACTIONS.FETCH_FS;
export const FETCH_ALERTS = AppConstants.ACTIONS.FETCH_ALERTS;
export const FETCH_SERVER_ALERTS = AppConstants.ACTIONS.FETCH_SERVER_ALERTS;
export const SET_ALERTS_WIDGET_RANGE = AppConstants.ACTIONS.SET_ALERTS_WIDGET_RANGE;
export const FETCH_CLUSTER_INFO = AppConstants.ACTIONS.FETCH_CLUSTER_INFO;

/**
 * Fetches alerts data from the API
 *
 * @param  {Array}   entityIds      IDs of file servers to fetch alerts for (optional)
 * @param  {String}  dateRange      Value to filter by date range (can be 'week', or 'day')
 *
 * @return {Function}               Dispatcher method
 */
export const fetchAlerts = (entityIds = [], dateRange = 'week') => {
  return async(dispatch) => {
    let filter_criteria = 'file_server!=[no_val]';
    if (Array.isArray(entityIds) && entityIds.length) {
      filter_criteria = `file_server=in=${entityIds.join(',')}`;
    }
    if (dateRange === 'week') {
      filter_criteria += '';
    } else if (dateRange === 'day') {
      filter_criteria += '';
    }
    filter_criteria += ';resolved==false';
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
          attribute: 'severity'
        },
        {
          attribute: '_created_timestamp_usecs_'
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

/**
 * Fetches alerts data from the API for single file server
 *
 * @param  {String}  entityId       ID of file server to fetch alerts for
 *
 * @return {Function}               Dispatcher method
 */
export const fetchServerAlerts = (entityId) => {
  return async(dispatch) => {
    const filter_criteria = `file_server=in=${entityId};resolved==false`;
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
          attribute: 'severity'
        },
        {
          attribute: '_created_timestamp_usecs_'
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
      type: FETCH_SERVER_ALERTS,
      payload: {
        entityId,
        alertsData
      }
    });
  };
};

export const fetchFsData = () => {
  return (dispatch) => {
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
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_FS,
          payload: resp.data
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_FS,
          payload: null
        });
      });
  };
};

/**
 * Sets alert witget range to 'day' or 'week
 * '
 * @param  {String} value Alert widget date range
 *
 * @return {Function} Dispatcher method
 */
export const setAlertsWidgetRange = (value) => {
  return (dispatch) => {
    dispatch({
      type: SET_ALERTS_WIDGET_RANGE,
      payload: value
    });
  };
};


/**
 * Fetches cluster info for given entity IDs
 *
 * @async
 *
 * @param  {String}  entityId     Cluster entity ID
 *
 * @return {Function}             Dispatcher method
 */
export const fetchClusterInfo = (entityId) => {
  return (dispatch) => {
    const query = {
      entity_type: 'cluster',
      entity_ids: [entityId],
      group_member_attributes: [
        {
          attribute: 'cluster_name'
        },
        {
          attribute: 'check.overall_score'
        },
        {
          attribute: 'capacity.runway'
        },
        {
          attribute: 'version'
        },
        {
          attribute: 'cluster_upgrade_status'
        },
        {
          attribute: 'hypervisor_types'
        },
        {
          attribute: 'num_vms'
        },
        {
          attribute: 'num_nodes'
        },
        {
          attribute: 'external_ip_address'
        }
      ]
    };

    return axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_CLUSTER_INFO,
          payload: {
            entityId,
            clusterData: resp.data
          }
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_CLUSTER_INFO,
          payload: {
            entityId,
            clusterData: null
          }
        });
      });
  };
};

