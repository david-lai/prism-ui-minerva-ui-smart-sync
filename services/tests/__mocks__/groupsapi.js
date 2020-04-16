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
      payload: mockStore.full.groupsapi.alertsData
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
      payload: mockStore.full.groupsapi.alertInfo
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


/**
 * Fetches detailed data for given file server
 *
 * @param  {String} entityId File server entity id
 * @return {[type]}          [description]
 */
export const fetchFsDetails = (entityId) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_FS_DETAILS,
      payload: {
        entityId,
        details: [
          {
            'id': 'fs_id',
            'entity_id': 'fs_id',
            'name': 'El-Captain',
            'cluster': null,
            'nvm_uuid_list': 'c4e1eefd-1154-4840-8629-fa6c052410af',
            'afs_version': '3.7.0-c62b24a28626a156b2287edfbd91a649cc7b930e',
            'cluster_uuid': 'cluster_uuid',
            'last_used_size_bytes': null,
            'ipv4_address': '10.51.17.184'
          }
        ]
      }
    });
  };
};

// /**
//  * Fetches detailed data for given file server
//  *
//  * @param  {Array}     entityIds   Cluster ids
//  * @return {undefined}
//  */
// export const fetchClusterDetails = (entityIds) => {
//   return (dispatch) => {
//     dispatch({
//       type: FETCH_CLUSTER_DETAILS,
//       payload: {
//         entityId,
//         details: [
//           {
//             'id': 'fs_id',
//             'entity_id': 'fs_id',
//             'name': 'El-Captain',
//             'cluster': null,
//             'nvm_uuid_list': 'c4e1eefd-1154-4840-8629-fa6c052410af',
//             'afs_version': '3.7.0-c62b24a28626a156b2287edfbd91a649cc7b930e',
//             'cluster_uuid': 'cluster_uuid',
//             'last_used_size_bytes': null,
//             'ipv4_address': '10.51.17.184'
//           }
//         ]
//       }
//     });
//   };
// };