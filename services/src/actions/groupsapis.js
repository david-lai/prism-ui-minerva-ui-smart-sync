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
export const {
  FETCH_FS,
  FETCH_ALERTS,
  FETCH_SUMMARY_ALERTS,
  FETCH_SERVER_ALERTS,
  SET_ALERTS_WIDGET_RANGE
} = AppConstants.ACTIONS;

/**
 * Fetches alerts data from the API
 *
 * @param  {Array}   entityIds      IDs of file servers to fetch alerts for (optional)
 *
 * @return {Function}               Dispatcher method
 */
export const fetchAlerts = (entityIds = []) => {
  return (dispatch) => {
    let filter_criteria = 'file_server!=[no_val]';
    if (Array.isArray(entityIds) && entityIds.length) {
      filter_criteria = `file_server=in=${entityIds.join(',')}`;
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
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_ALERTS,
          payload: resp.data
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_ALERTS,
          payload: false
        });
      });
  };
};

/**
 * Fetches alerts data from the API
 *
 * @param  {String}  dateRange      Value to filter by date range (can be 'week', or 'day')
 *
 * @return {Function}               Dispatcher method
 */
export const fetchSummaryAlerts = (dateRange = 'day') => {
  return (dispatch) => {
    let timestamp = new Date().getTime();

    if (dateRange === 'week') {
      timestamp -= (7 * 86400000);
    } else if (dateRange === 'day') {
      timestamp -= 86400000;
    }
    const filter_criteria = `_created_timestamp_usecs_=ge=${timestamp};resolved==false`;
    const query = {
      entity_type: 'alert',
      group_member_count: 1,
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
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_SUMMARY_ALERTS,
          payload: resp.data
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_SUMMARY_ALERTS,
          payload: false
        });
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
  return (dispatch) => {
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
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_SERVER_ALERTS,
          payload: {
            entityId,
            alertsData: resp.data
          }
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_SERVER_ALERTS,
          payload: false
        });
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
          payload: false
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
