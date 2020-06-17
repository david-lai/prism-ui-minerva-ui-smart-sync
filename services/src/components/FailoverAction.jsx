//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// FailoverAction is the Failover Action component
//
import React from 'react';
import {
  Link,
  TripleDotVerticalIcon,
  FlexLayout,
  Menu,
  MenuItem,
  Button,
  Dropdown
} from '@nutanix-ui/prism-reactjs';
import PropTypes from 'prop-types';

// Utils
import { MODAL_TYPE } from '../utils/AppConstants';

import i18n from '../utils/i18n';
// Helper to translate strings from this module
const i18nT = (key, defaultValue) => i18n.getInstance().t(
  'FailoverAction', key, defaultValue);

class FailoverAction extends React.Component {

  /**
   * Constructor method
   *
   * @param  {Object} props   Component props
   * @param  {Object} context Component conntext
   *
   * @return {undefined}
   */
  constructor(props, context) {
    super(props, context);
    this.handleShowFailoverActionModal = this.handleShowFailoverActionModal.bind(this);
  }

  // Handler to launch create case modal
  handleShowFailoverActionModal = () => {
    const {
      owner_fs_uuid: ownerFsUuid,
      primary_fs_uuid: primaryFsUuid,
      status
    } = this.props.options.entity;
    if (ownerFsUuid === primaryFsUuid && status === '1') {
      this.props.openModal(MODAL_TYPE.FAILOVER, this.props.options);
      // this.props.openModal(MODAL_TYPE.RESUME_REPLICATION, this.props.options);
    } else {
      this.props.openModal(MODAL_TYPE.FAILOVER, this.props.options);
    }
  }

  // Event handler for the dropdown click
  onMenuClick = (info) => {
    if (info.key === '1') {
      this.props.openModal(MODAL_TYPE.FAILOVER_AD_DNS_CONFIG, this.props.options);
    } else {
      this.props.openModal(MODAL_TYPE.CREATE_REVERSE_REPLICATION_POLICY, this.props.options);
    }
  }

  // Determin the action to show
  getActionText() {
    const {
      owner_fs_uuid: ownerFsUuid,
      primary_fs_uuid: primaryFsUuid,
      status
    } = this.props.options.entity;
    if (ownerFsUuid === primaryFsUuid && status === '1') {
      return i18nT('resume_replication', 'Resume Replication');
      // return i18nT('failover', 'Failover');
    }
    return i18nT('failback', 'Failback');
    // const action = 'failback';
    // switch (action) {
    //   case 'failback':
    //     return i18nT('failback', 'Failback');
    //   case 'retryFailover':
    //     return i18nT('retry_failover', 'Retry Failover');
    //   default:
    //     return i18nT('failover', 'Failover');
    // }
  }

  // Determine the dropdown options depending on the actions
  getMenu = () => {
    const {
      owner_fs_uuid: ownerFsUuid,
      primary_fs_uuid: primaryFsUuid,
      status
    } = this.props.options.entity;
    if (ownerFsUuid === primaryFsUuid && status === '1') {
      return (
        <Menu
          appearance={ Menu.APPEARANCE.COMPACT }
          onClick={ this.onMenuClick }
        >
          <MenuItem key="1">
            { i18nT('configure_dns_ad', 'Configure DNS and Active Directory') }
          </MenuItem>
          <MenuItem key="2">
            { i18nT('create_rr_policy', 'Create a Reverse Replication Policy') }
          </MenuItem>
        </Menu>
      );
    }
    return (
      <Menu
        appearance={ Menu.APPEARANCE.COMPACT }
        onClick={ this.onMenuClick }
      >
        <MenuItem key="1">
          { i18nT('configure_dns_ad', 'Configure DNS and Active Directory') }
        </MenuItem>;
      </Menu>
    );
  }

  render() {
    const menu = this.getMenu();
    return (
      <FlexLayout justifyContent="space-between" alignItems="center">
        <Link
          className="manage-link eb-actions-link fs-manage"
          onClick={ this.handleShowFailoverActionModal }
        >
          <span className="nsg-example-icon-text">{ this.getActionText() }</span>
        </Link>
        <Dropdown
          getPopupContainer={ () => document.querySelector('.right-panel') }
          popup={ menu }
          popupPlacement="leftTop"
          popupOffset={ { x:'-10px' } }
        >
          <Button type="borderless">
            <TripleDotVerticalIcon />
          </Button>
        </Dropdown>
      </FlexLayout>
    );
  }

}

FailoverAction.propTypes = {
  options: PropTypes.object,
  openModal: PropTypes.func
};

export default FailoverAction;
