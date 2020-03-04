//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Reducer
//

import AppConstants from './../utils/AppConstants';

// Actions
const {
  FETCH_FS,
  HIGHLIGHTED_WIDGET_BUSY,
  FETCH_ALERTS,

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
  SET_ALERTS_WIDGET_RANGE
} = AppConstants.ACTIONS;

// default state
const initialState = {
  alertsWidgetRange: 'day',
  alertsWidgetBusy: false,

  alertModalLoading: false,
  alertRequestActive: false,
  alertRequestType: '',
  alertRequestStatus: true,

  highlightedWidgetBusy: false,
  serverAlerts: {},
  alertInfo: false
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
