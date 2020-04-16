//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Reducer
//

import AppConstants from './../utils/AppConstants';
import AppUtil from '../utils/AppUtil';

// Actions
const {
  FETCH_FS,
  FETCH_FS_DETAILS,
  HIGHLIGHTED_WIDGET_BUSY,
  FETCH_ALERTS,
  FETCH_ALERT_LIST,
  SET_ALERT_LIST_LOADING,

  FETCH_ALERT_MODAL_INFO,
  ALERT_MODAL_LOADING,
  RESOLVE_ALERT,
  ACKNOWLEDGE_ALERT,
  ALERT_REQUEST_ACTIVE,
  ALERT_REQUEST_TYPE,
  ALERT_REQUEST_STATUS,

  FETCH_SERVER_ALERTS,
  FETCH_SUMMARY_ALERTS,
  SUMMARY_ALERTS_BUSY,
  SET_ALERTS_WIDGET_RANGE,
  FETCH_CLUSTER_DETAILS
} = AppConstants.ACTIONS;


// default state
const initialState = {
  alertsWidgetRange: 'day',
  alertsWidgetBusy: false,

  alertModalLoading: false,
  alertRequestActive: false,
  alertRequestType: '',
  alertRequestStatus: true,

  highlightedWidgetBusy: true,
  alertInfo: false,
  alertList: [],
  alertListLoading: false,
  fsDetails: {},
  serverAlerts: {},
  clusterDetails: {}
};


/**
 * Modals redurer
 * @param {Object} state - Current state.
 * @param {Object} action - Action
 * @returns {Object} - New state
 */
function groupsapis(state = initialState, action) {
  const { payload = {} } = action;
  switch (action.type) {
    case FETCH_FS:
      return {
        ...state,
        fsData: payload
      };
    case HIGHLIGHTED_WIDGET_BUSY:
      return {
        ...state,
        highlightedWidgetBusy: payload
      };
    case FETCH_ALERTS:
      return {
        ...state,
        alertsData: payload
      };

    case FETCH_ALERT_LIST:
      return {
        ...state,
        alertListLoading: false,
        alertList: payload && payload && payload.group_results
          ? AppUtil.extractGroupResults(payload)
          : []
      };

    case SET_ALERT_LIST_LOADING:
      return {
        ...state,
        alertListLoading: payload
      };

    case FETCH_ALERT_MODAL_INFO:
      return {
        ...state,
        alertModalLoading: false,
        alertInfo: payload
      };
    case ALERT_MODAL_LOADING:
      return {
        ...state,
        alertModalLoading: payload
      };

    case ALERT_REQUEST_ACTIVE:
      return {
        ...state,
        alertRequestActive: payload
      };
    case ALERT_REQUEST_TYPE:
      return {
        ...state,
        alertRequestType: payload
      };
    case ALERT_REQUEST_STATUS:
      return {
        ...state,
        alertRequestStatus: payload
      };
    case RESOLVE_ALERT:
      return {
        ...state,
        alertRequestActive: false,
        alertRequestStatus: payload
      };

    case ACKNOWLEDGE_ALERT:
      return {
        ...state,
        alertRequestActive: false,
        alertRequestStatus: payload
      };

    case SUMMARY_ALERTS_BUSY:
      return {
        ...state,
        alertsWidgetBusy: payload
      };
    case FETCH_SUMMARY_ALERTS:
      return {
        ...state,
        alertsWidgetBusy: false,
        summaryAlerts: payload
      };
    case FETCH_SERVER_ALERTS:
      return {
        ...state,
        highlightedWidgetBusy: false,
        serverAlerts: {
          ...state.serverAlerts,
          [payload.entityId]: payload.alertsData
        }
      };
    case SET_ALERTS_WIDGET_RANGE:
      return {
        ...state,
        alertsWidgetRange: payload
      };
    case FETCH_FS_DETAILS:
      const details = AppUtil.extractGroupResults(payload.details);
      if (details && Array.isArray(details) && details.length) {
        return {
          ...state,
          fsDetails: {
            ...state.fsDetails,
            [payload.entityId]: details[0]
          }
        };
      }
      return {
        ...state,
        fsDetails: {
          ...state.fsDetails,
          [payload.entityId]: false
        }
      };
    case FETCH_CLUSTER_DETAILS:
      let clusters = [];
      if (payload.details) {
        clusters = AppUtil.extractGroupResults(payload.details);
      }
      if (clusters && Array.isArray(clusters) && clusters.length) {
        return {
          ...state,
          clusterDetails: {
            ...clusters.reduce((acc, val) => {
              acc[val.id] = val;
              return acc;
            },
            state.clusterDetails
            )
          }
        };
      }
      return {
        ...state,
        clusterDetails: {
          ...payload.entityIds.reduce((acc, val) => {
            acc[val] = false;
            return acc;
          },
          state.clusterDetails
          )
        }
      };

    default:
      return state;
  }
}

export default groupsapis;
