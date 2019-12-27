//
// Copyright (c) 2018 Nutanix Inc. All rights reserved.
//
// Application wide utilities
//
import _each from 'lodash/each.js';
import axios from 'axios';
import AppUtil from './AppUtil';
import AppConstants from './AppConstants';


const CategoriesUtil = {

  // Fetch categories by category name
  fetchCategories(catName, doneCB, errorCB) {
    // Groups Query to get all categories by name
    const url = AppConstants.APIS.GROUPS_API;
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
      group_member_attributes: [{ attribute: 'name' }, { attribute: 'value' }],
      query_name: `serviceChains:${catName}`,
      filter_criteria: `name==${catName}`
    };

    return axios.post(url, query)
      .then((resp) => {
        const cats = AppUtil.extractGroupResults(resp.data);
        doneCB(cats);
      })
      .catch(() => {
        errorCB();
      });
  },

  // Fetch categories by category name
  queryCatPolicies(catName, catValues, doneCB, errorCB) {
    const url = AppConstants.APIS.CATS_QUERY_API;
    const query =
      { api_version:'3.0',
        group_member_count:30,
        group_member_offset:0,
        usage_type:'USED_IN',
        category_filter:{
          type:'CATEGORIES_MATCH_ANY',
          params:{}
        }
      };
    query.category_filter.params[catName] = catValues;

    return axios.post(url, query)
      .then((resp) => {
        const results = resp.data.results;
        const catsPolicyMap = {};
        _each(results, result => {
          _each(result.kind_reference_list, (kref) => {
            const policyName = kref.name;
            const cats = kref.categories[catName];
            _each(cats, cat => {
              catsPolicyMap[cat] = policyName;
            });
          });
        });
        doneCB(catsPolicyMap);
      })
      .catch((err) => {
        errorCB(err);
      });
  }

};

export default CategoriesUtil;
