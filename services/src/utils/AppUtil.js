//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// Application wide utilities
//
import axios from 'axios';
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

  /**
   * Fetches cluster info for given entity IDs
   *
   * @async
   *
   * @param  {String[]}  entityIds   An array of entity IDs
   *
   * @return {Object}                Cluster info data
   */
  fetchFileServers() {
    return new Promise((resolve, reject) => {
      const query = {
        entity_type: 'file_server_service',
        group_member_sort_attribute: 'name',
        group_member_sort_order: 'ASCENDING',
        group_member_count: 20,
        group_member_offset: 0,
        group_member_attributes: [
          {
            attribute: 'name'
          },
          {
            attribute: 'cluster'
          },
          {
            attribute: 'nvm_uuid_list'
          },
          {
            attribute: 'afs_version'
          },
          {
            attribute: 'cluster_uuid'
          }
        ]
      };
      return axios.post(AppConstants.APIS.GROUPS_API, query)
        .then((resp) => {
          if (resp && resp.data) {
            resolve(resp.data);
          } else {
            reject(new Error(`Unrecognized response: ${JSON.stringify(resp)}`));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  /**
   * Iterates through all servers and populates alert data for them
   *
   * @todo determine how to pass multiple server ids to api to avoid looping
   *
   * @param  {Object}  fsData         API response for file server service call
   * @param  {Boolean} unresolvedOnly Fetch only unresolved alerts
   *
   * @return {Object}                 API response for file server service call
   *                                  with 'alerts' array added to each entity
   */
  async populateServersAlertData(fsData, unresolvedOnly = true) {
    const data = {
      ...{},
      ...fsData
    };
    for (let i = 0; i < data.group_results.length; i++) {
      const gr = data.group_results[i];
      for (let j = 0; j < gr.entity_results.length; j++) {
        const serverAlerts = await this.fetchSingleServerAlertData(
          gr.entity_results[j].entity_id,
          unresolvedOnly
        );
        if (serverAlerts && serverAlerts.data) {
          data.group_results[i].entity_results[j].alerts =
            this.extractGroupResults(serverAlerts.data);
        }
      }
    }
    return data;
  },

  /**
   * Fetches alerts info for single server entity ID
   *
   * @async
   *
   * @param  {String}    entityId         File server entity id
   * @param  {Boolean}   unresolvedOnly   Fetch only unresolved alerts
   *
   * @return {Object}                     File server alert data
   */
  async fetchSingleServerAlertData(entityId, unresolvedOnly = true) {
    const query = {
      entity_type: 'alert',
      query_name: 'eb:data-1578012630011',
      grouping_attribute: '',
      group_count: 3,
      group_offset: 0,
      group_attributes: [],
      group_member_count: 120,
      group_member_offset: 0,
      group_member_sort_attribute: '_created_timestamp_usecs_',
      group_member_sort_order: 'DESCENDING',
      group_member_attributes: [
        {
          attribute: 'title'
        },
        {
          attribute: 'source_entity_name'
        },
        {
          attribute: 'impact_type'
        },
        {
          attribute: 'severity'
        },
        {
          attribute: 'resolved'
        },
        {
          attribute: 'acknowledged'
        },
        {
          attribute: '_created_timestamp_usecs_'
        },
        {
          attribute: 'cluster'
        },
        {
          attribute: 'default_message'
        },
        {
          attribute: 'param_name_list'
        },
        {
          attribute: 'param_value_list'
        },
        {
          attribute: 'auto_resolved'
        },
        {
          attribute: 'acknowledging_user'
        },
        {
          attribute: 'acknowledged_timestamp_usecs'
        },
        {
          attribute: 'resolving_user'
        },
        {
          attribute: 'resolved_timestamp_usecs'
        },
        {
          attribute: 'source_entity_uuid'
        },
        {
          attribute: 'source_entity_type'
        }
      ],
      filter_criteria: `file_server=in=${entityId}`
    };
    if (unresolvedOnly) {
      query.filter_criteria += ';resolved==false';
    }
    const resp = await axios.post(AppConstants.APIS.GROUPS_API, query);
    return resp;
  },

  /**
   * Fetches cluster info for given entity IDs
   *
   * @async
   *
   * @param  {String[]}  entityIds   An array of entity IDs
   *
   * @return {Object}                Cluster info data
   */
  async fetchClusterInfo(entityIds = []) {
    return new Promise((resolve, reject) => {
      const query = {
        entity_type: 'cluster',
        entity_ids: entityIds,
        group_member_attributes: [
          {
            attribute: 'cluster_name'
          },
          {
            attribute: 'check.overall_score'
          },
          {
            attribute: 'capacity.runway'
          },
          {
            attribute: 'version'
          },
          {
            attribute: 'cluster_upgrade_status'
          },
          {
            attribute: 'hypervisor_types'
          },
          {
            attribute: 'num_vms'
          },
          {
            attribute: 'num_nodes'
          },
          {
            attribute: 'external_ip_address'
          }
        ]
      };
      return axios.post(AppConstants.APIS.GROUPS_API, query)
        .then((resp) => {
          if (resp && resp.data) {
            resolve(resp.data);
          } else {
            reject(new Error(`Unrecognized response: ${JSON.stringify(resp)}`));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // Fetch categories by category name
  // TODO: Consolidate this with sec planning UI
  fetchCategories(catName, doneCB, errorCB) {
    // Groups Query to get all categories by name
    const query = {
      entity_type: 'category',
      grouping_attribute: 'abac_category_key',
      group_sort_attribute: 'name',
      group_count: 64,
      group_attributes: [{
        attribute: 'name',
        ancestor_entity_type: 'abac_category_key'
      }, {
        attribute: 'immutable',
        ancestor_entity_type: 'abac_category_key'
      }, {
        attribute: 'cardinality',
        ancestor_entity_type: 'abac_category_key'
      }, {
        attribute: 'description',
        ancestor_entity_type: 'abac_category_key'
      }, {
        attribute: 'total_policy_counts',
        ancestor_entity_type: 'abac_category_key'
      }, { attribute: 'total_entity_counts',
        ancestor_entity_type: 'abac_category_key' }],
      group_member_count: 1000,
      group_member_offset: 0,
      group_member_sort_attribute: 'value',
      group_member_attributes: [{ attribute: 'name' }, { attribute: 'value' },
        { attribute: 'entity_counts' }, { attribute: 'policy_counts' },
        { attribute: 'immutable' }
      ],
      query_name: `minervaFiles:${catName}`,
      filter_criteria: `name==${catName}`
    };

    return axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        const cats = AppUtil.extractGroupResults(resp.data);
        doneCB(cats);
      })
      .catch((err) => {
        errorCB();
      });
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
