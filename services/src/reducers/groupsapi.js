//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Reducer
//

// Actions
import {
  FETCH_FS,
  HIGHLIGHTED_WIDGET_BUSY,
  FETCH_ALERTS,
  FETCH_SERVER_ALERTS,
  FETCH_SUMMARY_ALERTS,
  SUMMARY_ALERTS_BUSY,
  SET_ALERTS_WIDGET_RANGE
} from '../actions/groupsapis';

// default state
const initialState = {
  alertsWidgetRange: 'day',
  alertsWidgetBusy: false,
  highlightedWidgetBusy: false,
  serverAlerts: {}
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
    default:
      return state;
  }
}

export default groupsapis;
