//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Reducer
//

// Actions
import {
  FETCH_FS,
  FETCH_FS_DETAILS,
  HIGHLIGHTED_WIDGET_BUSY,
  FETCH_ALERTS,
  FETCH_SERVER_ALERTS,
  FETCH_SUMMARY_ALERTS,
  SUMMARY_ALERTS_BUSY,
  SET_ALERTS_WIDGET_RANGE,

  FETCH_CLUSTER_DETAILS
} from '../actions/groupsapis';

import AppUtil from '../utils/AppUtil';

// default state
const initialState = {
  alertsWidgetRange: 'day',
  alertsWidgetBusy: false,
  highlightedWidgetBusy: false,
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
        highlightedWidgetBusy: false,
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
      const clusters = AppUtil.extractGroupResults(payload.details);
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
          ...state.clusterDetails,
          [payload.entityId]: false
        }
      };

    default:
      return state;
  }
}

export default groupsapis;
