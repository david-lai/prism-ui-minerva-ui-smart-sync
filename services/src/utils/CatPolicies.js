//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// Application wide utilities
//
import _uniq from 'lodash/uniq.js';
import AppConstants from './AppConstants';
import CategoryUtils from './CategoryUtils';

const CatPolicies = {
  fetchData() {
    return new Promise((resolve, reject) => {
      CategoryUtils.fetchCategories(AppConstants.CATEGORY.NET_SERVICE_PROVIDER,
        (cats) => {
          const catValues = cats.map(c => c.value);
          CategoryUtils.queryCatPolicies(AppConstants.CATEGORY.NET_SERVICE_PROVIDER,
            catValues,
            (catsPolicyMap) => {
              resolve(catsPolicyMap);
            },
            () => {
              reject('Error fetching policies');
            },
          );
        },
        () => {
          reject('Error fetching categories');
        });
    });
  },

  // Get policies for given cat values
  getPolicies(catsPolicyMap, catValues) {
    const ret = [];
    catValues.forEach(cv => {
      const policy = catsPolicyMap[cv];
      if (policy) {
        ret.push(policy);
      }
    });
    return _uniq(ret);
  }
};

export default CatPolicies;
