//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// Application wide utilities
//
import { AphroditeApi } from 'prism-utils-common';

import AppConstants from './AppConstants';

const AppUtil = {

  // @param error - error from axios
  extractErrorMsg(error = {}) {
    if (error && error.response && error.response.data) {
      const msgs = error.response.data.message_list || [];
      return msgs.length ? msgs[0].message : '';
    }
    return '';
  },

  // Flattens group results for entities
  extractGroupResults(gr) {
    let ret = [];
    if (gr.group_results && gr.group_results.length && gr.group_results[0].entity_results) {
      ret = gr.group_results[0].entity_results.map(e => {
        const eHash = {
          id: e.entity_id,
          entity_id: e.entity_id
        };
        e.data.forEach(ed => {
          eHash[ed.name] = ed.values.length
            ? ed.values[0].values[0] : null;
        });
        return eHash;
      });
    }
    return ret;
  },

  // Formats raw numeric values.
  // eg 1000 is converted to 1K
  // @param value    - Numeric value
  // @param floor    - Boolean, determines if value is rounded or floored
  // @return formatted string
  rawNumericFormat(value, floor) {
    const units = ['', 'K', 'M', 'B', 'T', 'P'];
    let returnValue = 0;
    let power = 0;

    if (isNaN(value) || value === -1 || value === null) {
      return '';
    }

    if (value === 0) {
      return '0';
    }

    for (let i = units.length - 1; i >= 0; i--) {
      if ((value / Math.pow(1000, i)) >= 1 || i === 0) {
        power = i;
        break;
      }
    }

    const valPoweredDown = value / Math.pow(1000, power);
    if (floor) {
      returnValue =
        this.formatDecimalDigits(valPoweredDown, 3, true) +
        units[power];
    } else {
      returnValue = (Math.round(valPoweredDown * 100) / 100) + units[power];
    }

    return returnValue;
  },

  // Parse a category string into a category name-value hash
  categoryFromString(cat) {
    const parts = cat.split(AppConstants.ENTITY_CATEGORY_SEPARATOR);
    const name = parts[0].trim();
    const value = (parts.length === 2) ? parts[1].trim() : '';
    return {
      name,
      value
    };
  },

  entityToPlainObject(entity) {
    if (entity && entity.data && Array.isArray(entity.data)) {
      return entity.data.reduce((acc, val) => {
        const value = val.values && val.values.length &&
          val.values[0].values && val.values[0].values.length ? val.values[0].values[0] : null;
        acc[val.name] = value;
        return acc;
      }, {
        entity_id: entity.entity_id
      });
    }
    return {};
  },

  // Only works in the Embedded Mode.
  showNotification(notificationType, msg) {
    const NotificationManager = this._getNotificationManager();
    if (NotificationManager) {
      NotificationManager.showClientNotification(notificationType, msg);
    }
  },

  // Get the Aphrodite Notifications Manager (extracted for testability)
  _getNotificationManager() {
    return AphroditeApi && AphroditeApi.Managers && AphroditeApi.Managers.NotificationManager;
  }

};

export default AppUtil;
