//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Groups API Actions
//

import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import AppConstants from './../utils/AppConstants';
import AppUtil from './../utils/AppUtil';

// ------------
// Action Types
// ------------
export const {
  FETCH_FS,
  FETCH_FS_DETAILS,
  HIGHLIGHTED_WIDGET_BUSY,
  FETCH_ALERTS,
  TRIGGER_FAILOVER,

  ALERT_MODAL_LOADING,
  FETCH_ALERT_MODAL_INFO,
  RESOLVE_ALERT,
  ACKNOWLEDGE_ALERT,
  ALERT_REQUEST_ACTIVE,
  ALERT_REQUEST_TYPE,
  ALERT_REQUEST_STATUS,

  FETCH_EVENTS,
  EVENT_LIST_LOADING,

  FETCH_SUMMARY_ALERTS,
  SUMMARY_ALERTS_BUSY,
  FETCH_SERVER_ALERTS,
  SET_ALERTS_WIDGET_RANGE,

  FETCH_CLUSTER_DETAILS
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
    let filter_criteria = 'file_server!=[no_val]';
    if (Array.isArray(entityIds) && entityIds.length) {
      filter_criteria = `file_server=in=${entityIds.join(',')}`;
    }
    filter_criteria += ';resolved==false';
    const query = {
      entity_type: 'alert',
      group_member_offset: 0,
      group_member_sort_attribute: '_created_timestamp_usecs_',
      group_member_sort_order: 'DESCENDING',
      group_member_attributes: [
        {
          attribute: 'title'
        },
        {
          attribute: 'severity'
        },
        {
          attribute: '_created_timestamp_usecs_'
        }
      ],
      filter_criteria
    };
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_ALERTS,
          payload: resp.data
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_ALERTS,
          payload: false
        });
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
      payload: false
    });
    dispatch({
      type: ALERT_MODAL_LOADING,
      payload: true
    });
    const url = `${AppConstants.APIS.ALERTS_API}/${entityId}`;
    // Load alert info
    axios.get(url)
      .then((resp) => {
        let payload = false;
        if (resp && resp.status && resp.status === 200 && resp.data) {
          payload = {
            entity: {
              ...resp.data.status.resources,
              entityId
            }
          };
        }
        dispatch({
          type: FETCH_ALERT_MODAL_INFO,
          payload
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_ALERT_MODAL_INFO,
          payload: false
        });
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
      type: ALERT_REQUEST_ACTIVE,
      payload: true
    });
    dispatch({
      type: ALERT_REQUEST_TYPE,
      payload: 'resolve'
    });
    const query = entityIds;
    axios.post(`${AppConstants.APIS.PRISM_GATEWAY}/alerts/resolve_list`, query)
      .then((resp) => {
        let payload = false;
        if (resp && resp.data && Array.isArray(resp.data)) {
          payload = true;
        }
        dispatch({
          type: RESOLVE_ALERT,
          payload
        });
      })
      .catch((ex) => {
        dispatch({
          type: RESOLVE_ALERT,
          payload: false
        });
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
      type: ALERT_REQUEST_ACTIVE,
      payload: true
    });
    dispatch({
      type: ALERT_REQUEST_TYPE,
      payload: 'acknowledge'
    });
    const query = entityIds;
    axios.post(`${AppConstants.APIS.PRISM_GATEWAY}/alerts/acknowledge_list`, query)
      .then((resp) => {
        let payload = false;
        if (resp && resp.data && Array.isArray(resp.data)) {
          payload = true;
        }
        dispatch({
          type: ACKNOWLEDGE_ALERT,
          payload
        });
      })
      .catch((ex) => {
        dispatch({
          type: ACKNOWLEDGE_ALERT,
          payload: false
        });
      });
  };
};


/**
 * Fetches alerts data from the API
 *
 * @param  {String}  dateRange      Value to filter by date range (can be 'week', or 'day')
 *
 * @return {Function}               Dispatcher method
 */
export const fetchSummaryAlerts = (dateRange = 'day') => {
  return (dispatch) => {
    dispatch({
      type: SUMMARY_ALERTS_BUSY,
      payload: true
    });
    let timestamp;

    if (dateRange === 'week') {
      timestamp = (moment().subtract('1', 'weeks')).valueOf();
    } else if (dateRange === 'day') {
      timestamp = (moment().subtract('1', 'days')).valueOf();
    }
    const filter_criteria = `_created_timestamp_usecs_=ge=${timestamp}000;resolved==false`;
    const query = {
      entity_type: 'alert',
      group_member_attributes: [
        {
          attribute: 'title'
        },
        {
          attribute: 'severity'
        },
        {
          attribute: '_created_timestamp_usecs_'
        }
      ],
      filter_criteria
    };
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_SUMMARY_ALERTS,
          payload: resp.data
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_SUMMARY_ALERTS,
          payload: false
        });
      });
  };
};


/**
 * Fetches alerts data from the API for single file server
 *
 * @param  {String}  entityId       ID of file server to fetch alerts for
 *
 * @return {Function}               Dispatcher method
 */
export const fetchServerAlerts = (entityId) => {
  return (dispatch) => {
    const filter_criteria = `file_server=in=${entityId};resolved==false`;
    const query = {
      entity_type: 'alert',
      group_member_offset: 0,
      group_member_sort_attribute: '_created_timestamp_usecs_',
      group_member_sort_order: 'DESCENDING',
      group_member_attributes: [
        {
          attribute: 'title'
        },
        {
          attribute: 'severity'
        },
        {
          attribute: '_created_timestamp_usecs_'
        }
      ],
      filter_criteria
    };
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_SERVER_ALERTS,
          payload: {
            entityId,
            alertsData: resp.data
          }
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_SERVER_ALERTS,
          payload: false
        });
      });
  };
};

/**
 * Start Failover action
 * @param {String} extId - file server uuid
 * @param {Object} failoverData - the payload for failover action
 * @return {undefined}
 */
export const triggerFailover = (extId, failoverData) => {
  return (dispatch) => {
    const url = _.template(AppConstants.APIS.FAILOVER_API)({ extId });

    axios.post(url, failoverData)
      .then((resp) => {
        dispatch({
          type: TRIGGER_FAILOVER,
          payload: resp.data
        });
      })
      .catch((ex) => {
        dispatch({
          type: TRIGGER_FAILOVER,
          payload: false
        });
      });
  };
};

/**
 * Fetches files data
 * @return {undefined}
 */
export const fetchFsData = () => {
  return (dispatch) => {
    dispatch({
      type: HIGHLIGHTED_WIDGET_BUSY,
      payload: true
    });
    const query = {
      entity_type: 'file_server_service',
      group_member_sort_attribute: 'name',
      group_member_sort_order: 'ASCENDING',
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
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_FS,
          payload: resp.data
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_FS,
          payload: false
        });
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
    const query = {
      entity_type: 'file_server_service',
      entity_ids: [entityId],
      group_member_attributes: [
        {
          attribute: 'last_used_size_bytes'
        },
        {
          attribute: 'ipv4_address'
        }
      ]
    };
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_FS_DETAILS,
          payload: {
            entityId,
            details: resp.data
          }
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_FS_DETAILS,
          payload: {
            entityId,
            details: false
          }
        });
      });
  };
};

/**
 * Fetches detailed data for given file server
 *
 * @param  {Array}     entityIds   Cluster ids
 * @return {undefined}
 */
export const fetchClusterDetails = (entityIds) => {
  if (!Array.isArray(entityIds)) {
    entityIds = [entityIds];
  }
  return (dispatch) => {
    const query = {
      entity_type: 'cluster',
      entity_ids: entityIds,
      group_member_attributes: [
        {
          attribute: 'cluster_name'
        }
      ]
    };
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        dispatch({
          type: FETCH_CLUSTER_DETAILS,
          payload: {
            entityIds,
            details: resp.data
          }
        });
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_CLUSTER_DETAILS,
          payload: {
            entityIds,
            details: false
          }
        });
      });
  };
};

/**
 * Sets alert witget range to 'day' or 'week
 * '
 * @param  {String} value Alert widget date range
 *
 * @return {Function} Dispatcher method
 */
export const setAlertsWidgetRange = (value) => {
  return (dispatch) => {
    dispatch({
      type: SET_ALERTS_WIDGET_RANGE,
      payload: value
    });
  };
};

/**
 * Fetches events data from the API
 *
 * @return {Function}               Dispatcher method
 */
export const fetchEvents = () => {
  return (dispatch) => {
    dispatch({
      type: EVENT_LIST_LOADING,
      payload: true
    });
    const query = {
      entity_type: 'event',
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
          attribute: 'cluster'
        },
        {
          attribute: 'source_entity_uuid'
        },
        {
          attribute: 'source_entity_type'
        },
        {
          attribute: 'operation_type'
        },
        {
          attribute: 'default_message'
        },
        {
          attribute: 'param_name_list'
        },
        {
          attribute: 'param_value_list'
        }
      ],
      filter_criteria: 'file_server!=[no_val]'
    };
    axios.post(AppConstants.APIS.GROUPS_API, query)
      .then((resp) => {
        if (resp && resp.status && resp.status === 200 && resp.data) {
          const results = AppUtil.extractGroupResults(resp.data);
          const eventIds = results.map(li => li.entity_id);
          let url = `${AppConstants.APIS.PRISM_GATEWAY}/events`;
          url += `?event_ids=${eventIds.join(',')}&detailed_info=true&__=${new Date().getTime()}`;
          axios.get(url)
            .then((detailResp) => {
              let itemDetails = [];
              if (detailResp && detailResp.status && detailResp.status === 200 && detailResp.data) {
                if (
                  detailResp.data &&
                  detailResp.data.entities &&
                  Array.isArray(detailResp.data.entities)
                ) {
                  const itemList = results.map(il => {
                    const details = detailResp.data.entities.find(re => re.id === il.entity_id);
                    if (details) {
                      il.details = details;
                    }
                    return il;
                  });
                  itemDetails = itemList;
                }
              }
              const eventList = itemDetails.map((listItem) => {
                const paramNames = listItem.details &&
                  listItem.details.contextTypes
                  ? listItem.details.contextTypes
                  : [];

                const paramValues = listItem.details &&
                  listItem.details.contextValues
                  ? listItem.details.contextValues
                  : [];

                const parameters = paramNames.reduce((acc, val, index) => {
                  acc[val] = paramValues[index];
                  return acc;
                }, {});
                listItem.default_message = listItem.default_message.replace(/(\{[^}]+\})/g, (propVar) => {
                  const propName = propVar.replace(/[{}]/g, '');
                  let propValue = '';
                  if (
                    parameters &&
                    parameters[propName]
                  ) {
                    propValue = parameters[propName];
                  }
                  return propValue;
                });
                return listItem;
              });
              dispatch({
                type: FETCH_EVENTS,
                payload: eventList
              });
            })
            .catch((ex) => {
              dispatch({
                type: FETCH_EVENTS,
                payload: false
              });
            });
        } else {
          dispatch({
            type: FETCH_EVENTS,
            payload: false
          });
        }
      })
      .catch((ex) => {
        dispatch({
          type: FETCH_EVENTS,
          payload: false
        });
      });
  };
};
