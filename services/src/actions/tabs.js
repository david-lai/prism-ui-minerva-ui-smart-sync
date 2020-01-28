//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Tabs Actions
//

import AppConstants from '../utils/AppConstants';

// ------------
// Action Types
// ------------
export const SET_TAB = AppConstants.ACTIONS.SET_TAB;

// ---------------
// Action Creators
// ---------------

/**
 * Sets tab for file servers view
 *
 * @param   {Number}     tabIndex     New tab index
 *
 * @returns {Object}                  Action object
 */
export function setTab(tabIndex = 0) {
  return {
    type: SET_TAB,
    payload: tabIndex
  };
}
