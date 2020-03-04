//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Actions
//


import mockStore from '../../mockStore';
import moment from 'moment';
// import axios from 'axios';
import AppConstants from '../../utils/AppConstants';

// ------------
// Action Types
// ------------
export const {
  FETCH_FS,
  HIGHLIGHTED_WIDGET_BUSY,
  FETCH_ALERTS,

  ALERT_MODAL_LOADING,
  FETCH_ALERT_MODAL_INFO,
  RESOLVE_ALERT,
  ACKNOWLEDGE_ALERT,
  ALERT_REQUEST_ACTIVE,
  ALERT_REQUEST_TYPE,
  ALERT_REQUEST_STATUS,

  FETCH_SUMMARY_ALERTS,
  SUMMARY_ALERTS_BUSY,
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
    dispatch({
      type: FETCH_ALERTS,
      payload: mockStore.groupsapi.alertsData
    });
  };
};

/**
 * Fetches alert info from the API
 *
 * @param  {String}   entityId     IDs of file servers to fetch alerts for (optional)
 *
 * @return {Function}               Dispatcher method
 */
export const fetchAlertModalInfo = (entityId) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_ALERT_MODAL_INFO,
      payload: mockStore.groupsapi.alertInfo
    });
  };
};

/**
 * Sets alert request type
 *
 * @param  {String}   value       Boolean type
 *
 * @return {Function}               Dispatcher method
 */
export const setAlertRequestType = (value) => {
  return (dispatch) => {
    dispatch({
      type: ALERT_REQUEST_TYPE,
      payload: value
    });
  };
};

/**
 * Sets alert request status
 *
 * @param  {Boolean}   value       Boolean status
 *
 * @return {Function}               Dispatcher method
 */
export const setAlertRequestStatus = (value) => {
  return (dispatch) => {
    dispatch({
      type: ALERT_REQUEST_STATUS,
      payload: value
    });
  };
};

/**
 * Resolves alerts
 *
 * @param  {Array}   entityIds      IDs of file servers to fetch alerts for (optional)
 *
 * @return {Function}               Dispatcher method
 */
export const resolveAlert = (entityIds = []) => {
  return (dispatch) => {
    dispatch({
      type: RESOLVE_ALERT,
      payload: true
    });
  };
};


/**
 * Resolves alerts
 *
 * @param  {Array}   entityIds      IDs of file servers to fetch alerts for (optional)
 *
 * @return {Function}               Dispatcher method
 */
export const acknowledgeAlert = (entityIds = []) => {
  return (dispatch) => {
    dispatch({
      type: ACKNOWLEDGE_ALERT,
      payload: true
    });
  };
};


// /**
//  * Fetches alerts data from the API
//  *
//  * @param  {String}  dateRange      Value to filter by date range (can be 'week', or 'day')
//  *
//  * @return {Function}               Dispatcher method
//  */
// export const fetchSummaryAlerts = (dateRange = 'day') => {
//   return (dispatch) => {
//     dispatch({
//       type: SUMMARY_ALERTS_BUSY,
//       payload: true
//     });
//     let timestamp;

//     if (dateRange === 'week') {
//       timestamp = (moment().subtract('1', 'weeks')).valueOf();
//     } else if (dateRange === 'day') {
//       timestamp = (moment().subtract('1', 'days')).valueOf();
//     }
//     const filter_criteria = `_created_timestamp_usecs_=ge=${timestamp}000;resolved==false`;
//     const query = {
//       entity_type: 'alert',
//       group_member_count: 1,
//       group_member_attributes: [
//         {
//           attribute: 'title'
//         },
//         {
//           attribute: 'severity'
//         },
//         {
//           attribute: '_created_timestamp_usecs_'
//         }
//       ],
//       filter_criteria
//     };
//     axios.post(AppConstants.APIS.GROUPS_API, query)
//       .then((resp) => {
//         dispatch({
//           type: FETCH_SUMMARY_ALERTS,
//           payload: resp.data
//         });
//       })
//       .catch((ex) => {
//         dispatch({
//           type: FETCH_SUMMARY_ALERTS,
//           payload: false
//         });
//       });
//   };
// };


// /**
//  * Fetches alerts data from the API for single file server
//  *
//  * @param  {String}  entityId       ID of file server to fetch alerts for
//  *
//  * @return {Function}               Dispatcher method
//  */
// export const fetchServerAlerts = (entityId) => {
//   return (dispatch) => {
//     const filter_criteria = `file_server=in=${entityId};resolved==false`;
//     const query = {
//       entity_type: 'alert',
//       group_member_offset: 0,
//       group_member_sort_attribute: '_created_timestamp_usecs_',
//       group_member_sort_order: 'DESCENDING',
//       group_member_attributes: [
//         {
//           attribute: 'title'
//         },
//         {
//           attribute: 'severity'
//         },
//         {
//           attribute: '_created_timestamp_usecs_'
//         }
//       ],
//       filter_criteria
//     };
//     axios.post(AppConstants.APIS.GROUPS_API, query)
//       .then((resp) => {
//         dispatch({
//           type: FETCH_SERVER_ALERTS,
//           payload: {
//             entityId,
//             alertsData: resp.data
//           }
//         });
//       })
//       .catch((ex) => {
//         dispatch({
//           type: FETCH_SERVER_ALERTS,
//           payload: false
//         });
//       });
//   };
// };

// export const fetchFsData = () => {
//   return (dispatch) => {
//     dispatch({
//       type: HIGHLIGHTED_WIDGET_BUSY,
//       payload: true
//     });
//     const query = {
//       entity_type: 'file_server_service',
//       group_member_sort_attribute: 'name',
//       group_member_sort_order: 'ASCENDING',
//       group_member_offset: 0,
//       group_member_attributes: [
//         {
//           attribute: 'name'
//         },
//         {
//           attribute: 'cluster'
//         },
//         {
//           attribute: 'nvm_uuid_list'
//         },
//         {
//           attribute: 'afs_version'
//         },
//         {
//           attribute: 'cluster_uuid'
//         }
//       ]
//     };
//     axios.post(AppConstants.APIS.GROUPS_API, query)
//       .then((resp) => {
//         dispatch({
//           type: FETCH_FS,
//           payload: resp.data
//         });
//       })
//       .catch((ex) => {
//         dispatch({
//           type: FETCH_FS,
//           payload: false
//         });
//       });
//   };
// };

// /**
//  * Sets alert witget range to 'day' or 'week
//  * '
//  * @param  {String} value Alert widget date range
//  *
//  * @return {Function} Dispatcher method
//  */
// export const setAlertsWidgetRange = (value) => {
//   return (dispatch) => {
//     dispatch({
//       type: SET_ALERTS_WIDGET_RANGE,
//       payload: value
//     });
//   };
// };
