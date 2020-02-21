//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// EBComponentFactory is the component factory for EB
// This implementaton provides components for the Security Planning UI
//

// Libraries
import React from 'react';
import { AphroditeApi, WindowsMessageUtil } from 'prism-utils-common';
import { OpenInNewWindowIcon, TextLabel, Link, FlexLayout } from 'prism-reactjs';

// Popups
import FileServersName from '../components/FileServersName.jsx';

// Local includes
import AppConstants from './AppConstants';
import FormatterUtil from './FormatterUtil';

import i18n from './i18n';
// Helper to translate strings from this module
const i18nT = (key, defaultValue) => i18n.getInstance().t(
  'EBComponentFactory', key, defaultValue);

// The custom components for sec planning
const COMPONENTS = {
  NAME: 'fs_name',
  ACTIONS: 'actions',
  NUMBER_OF_VMS: 'number_of_vms',
  VERSION: 'version',
  SEPARATE_PASCAL_CASE: 'separate_pascal_case',
  CAPITALIZE_SENTENCE: 'capitalize_sentence',
  JOIN_STRING_ARRAY: 'join_string_array',
  JOIN_PASCAL_CASE_ARRAY: 'join_pascal_case_array',
  PICK_LIST_ITEM: 'pick_list_item'
};

// Components
class EBComponentFactory {

  constructor(options) {
    options = options || {};
    this.parser = options.parser;
    this.popupContext = {};
    // this.popupElement = React.createRef();
    this.popup = {};
    this.openModal = options.openModal;

    this.onOpenPeClick = this.onOpenPeClick.bind(this);
  }

  // Set context for popups.
  // In this case, we use it for storing the catsPoliciesMap
  setPopupContext(context) {
    this.popupContext = context;
  }

  // Event handler for manage button to open PE
  onOpenPeClick(e) {
    const clusterUuid = e.currentTarget.getAttribute('data-name');
    this.openPe(clusterUuid);
  }

  // Method to message PC to open PE
  openPe(clusterUuid) {
    WindowsMessageUtil.postMessage({
      service: AppConstants.SERVICE_NAME.PRISM_UI,
      target: AppConstants.IFRAME_EVENT_OPEN_PE,
      state: AppConstants.FS_PC_TO_PE,
      serviceTargets: clusterUuid
    }, '*', window.parent);
  }

  getComponent(componentId, options) {
    switch (componentId) {
      case COMPONENTS.NAME:
        return (
          <FileServersName options={ {
            ...options.options,
            openPe: this.openPe
          } } openModal={ this.openModal } />
        );
      case COMPONENTS.ACTIONS:
        return (
          <Link className="manage-link" data-name={ options.options.entity.cluster_uuid }
            onClick={ this.onOpenPeClick }>
            <FlexLayout alignItems="center" itemSpacing="5px">
              <TextLabel className="nsg-example-icon-text">{i18nT('manage', 'Manage')}</TextLabel>
              <OpenInNewWindowIcon />
            </FlexLayout>
          </Link>);
      case COMPONENTS.VERSION:
        const version = options.options.entity.afs_version.split('-')[0];
        return (<span>{ version }</span>);
      case COMPONENTS.NUMBER_OF_VMS:
        const numberOfVms = options.options.entity.nvm_uuid_list.split(',').length || 0;
        return (<span>{ numberOfVms }</span>);
      case COMPONENTS.SEPARATE_PASCAL_CASE:
        let separatedPascalCase = '';
        if (options && options.text) {
          separatedPascalCase = FormatterUtil.separatePascalCase(options.text, options.options);
        }
        return (<span>{ separatedPascalCase }</span>);
      case COMPONENTS.CAPITALIZE_SENTENCE:
        let capitalizedSentence = '';
        if (options && options.text) {
          capitalizedSentence = FormatterUtil.capitalizeSentence(options.text, options.options);
        }
        return (<span>{ capitalizedSentence }</span>);
      case COMPONENTS.JOIN_STRING_ARRAY:
        let joinedStringArray = '';
        if (options && options.text) {
          joinedStringArray = FormatterUtil.joinStringArray(options.text, options.options);
        }
        return (<span>{ joinedStringArray }</span>);
      case COMPONENTS.JOIN_PASCAL_CASE_ARRAY:
        let joinedPascalCaseArray = '';
        if (options && options.text) {
          joinedPascalCaseArray = FormatterUtil.separatePascalCase(
            FormatterUtil.joinStringArray(options.text, options.options), options.options
          );
        }
        return (<span>{ joinedPascalCaseArray }</span>);
      case COMPONENTS.PICK_LIST_ITEM:
        const listItemValue = FormatterUtil.pickListItem(options.text, options.options);
        return (<span>{ listItemValue }</span>);
      default:
        return this.defaultFactory.getComponent(componentId, options);
    }
  }

  // Pluck a nested network_function_list argument - Single value
  _getAttrValue(scChain, attr) {
    return scChain.network_function_list && scChain.network_function_list.length &&
      scChain.network_function_list[0][attr];
  }

  // Pluck a nested network_function_list argument - Array of value
  _getAttrValues(scChain, attr) {
    return scChain.network_function_list && scChain.network_function_list.length &&
      scChain.network_function_list.map(nf => nf[attr]);
  }

  // Given an entity, get the category value(s) its using
  _getCatValues(entity) {
    const catsFilter = this._getAttrValue(entity, 'category_filter');
    return catsFilter && catsFilter.params &&
      catsFilter.params[AppConstants.CATEGORY.NET_SERVICE_PROVIDER];
  }

  /**
   * Return the registered filter parser
   * @returns {Object} Filter Parser
   */
  getFilterParser() {
    return this.parser || this.defaultFactory.getFilterParser();
  }

  /**
   * Sets the default factory. Used to delegate for
   * components that this factory does not provide.
   * @param {Object} factory - Default factory from EB
   */
  setDefaultFactory(factory) {
    this.defaultFactory = factory;
  }

  // Get the real or mock aphrodite API
  _getAproditeAPI() {
    return AphroditeApi;
  }

}

let _instance = null;

export default {
  getInstance(options) {
    if (_instance === null) {
      _instance = new EBComponentFactory(options);
    }

    return _instance;
  }
};
