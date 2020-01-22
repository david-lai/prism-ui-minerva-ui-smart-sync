//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Quesy Utils
//

import axios from 'axios';
import AppConstants from './AppConstants';
import AppUtil from './AppUtil';

const FilesQuery = {
  fetchFsData(entityType) {
    return new Promise((resolve, reject) => {
      this.groupFetch(entityType,
        (files) => {
          resolve(files);
        },
        () => {
          reject('Error fetching Filies');
        });
    });
  },

  // Get files
  groupFetch(entityType, doneCB, errorCB) {
    // Groups Query to get all filss by name
    const url = AppConstants.APIS.GROUPS_API;
    const query = {
      entity_type: entityType,
      group_sort_attribute: 'name',
      group_member_count: 1000,
      group_member_offset: 0,
      group_member_sort_attribute: 'name',
      group_member_attributes: [{ attribute: 'name' }]
    };

    return axios.post(url, query)
      .then((resp) => {
        const files = AppUtil.extractGroupResults(resp.data);
        doneCB(files);
      })
      .catch(() => {
        errorCB();
      });
  }
};

export default FilesQuery;
