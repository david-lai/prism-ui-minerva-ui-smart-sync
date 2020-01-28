//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Reducer
//

// Actions
import {
  FETCH_FS,
  FETCH_ALERTS
} from '../actions/groupsapis';

/**
 * Modals redurer
 * @param {Object} state - Current state.
 * @param {Object} action - Action
 * @returns {Object} - New state
 */
function groupsapis(state = {}, action) {
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
    default:
      return state;
  }
}

export default groupsapis;
