//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Reducer
//

// Actions
import {
  FETCH_FS,
  FETCH_ALERTS,
  FETCH_SERVER_ALERTS,
  FETCH_CLUSTER_INFO,
  SET_ALERTS_WIDGET_RANGE
} from '../actions/groupsapis';

// default state
const initialState = {
  alertsWidgetRange: 'day',
  serverAlerts: {},
  clusters: {}
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
    case FETCH_ALERTS:
      return {
        ...state,
        alertsData: payload
      };
    case FETCH_SERVER_ALERTS:
      return {
        ...state,
        serverAlerts: {
          ...state.serverAlerts,
          [payload.entityId]: payload.alertsData
        }
      };
    case FETCH_CLUSTER_INFO:
      return {
        ...state,
        clusters: {
          ...state.clusters,
          [payload.entityId]: payload.clusterData
        }
      };
    case SET_ALERTS_WIDGET_RANGE:
      return {
        ...state,
        alertsWidgetRange: payload
      };
    default:
      return state;
  }
}

export default groupsapis;
