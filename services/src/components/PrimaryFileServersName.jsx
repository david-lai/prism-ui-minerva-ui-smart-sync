//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// PrimaryFileServersName is the primary file servers name component
//
import React from 'react';
import {
  Link,
  FlexLayout,
  Tooltip,
  Title,
  StackingLayout
} from '@nutanix-ui/prism-reactjs';

import PropTypes from 'prop-types';

// Utils
import { MODAL_TYPE } from '../utils/AppConstants';

// Custom Icon
import replicationAtoS from '../assets/images/replication-active-to-scondary.svg';
import replicationStoA from '../assets/images/replication-secondary-to-active.svg';
import StatusFailoverFailbackError from '../assets/images/StatusFailoverFailbackError.svg';

import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'PrimaryFileServersName', key, defaultValue, replacedValue);

class PrimaryFileServersName extends React.Component {

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

    this.handleShowFsDetailsModal = this.handleShowFsDetailsModal.bind(this);
  }

  // Handler to launch create case modal
  handleShowFsDetailsModal = () => {
    this.props.openModal(MODAL_TYPE.FILE_SERVER_DETAILS, this.props.options);
  }

  getReplicationError = () => {
    const tooltipText = (
      <StackingLayout>
        <Title size="h3">{ i18nT('replication_error', 'Replication Error') }</Title>
        { i18nT('replication_error_text1', 'replication_error_text1') }
        <br />
        { i18nT('replication_error_text2', 'replication_error_text2') }
        <br />
        { i18nT('replication_error_text3', 'replication_error_text3') }
        <br />
        { i18nT('replication_error_text4', 'replication_error_text4') }
        <br />
        { i18nT('replication_error_text5', 'replication_error_text5') }
      </StackingLayout>
    );
    return (
      <FlexLayout
        alignItems="center"
        itemSpacing="5px"
      >
        <Tooltip
          popupPlacement="left"
          content={ tooltipText }
          getPopupContainer={ () => document.querySelector('.right-panel') }
        >
          <img src={ StatusFailoverFailbackError } height="15px" />
        </Tooltip>
        <div>
          { i18nT('replication_error', 'Replication Error') }
        </div>
      </FlexLayout>
    );
  }

  getFailoverFailbackIcon() {
    const {
      owner_fs_uuid: ownerFsUuid,
      primary_fs_uuid: primaryFsUuid,
      status
    } = this.props.options.entity;

    let imgSrc = replicationAtoS;
    if (ownerFsUuid === primaryFsUuid && status === '1') {
      return this.getReplicationError();
    }

    imgSrc = replicationStoA;
    return (
      <img src={ imgSrc } height="15px" />
    );
  }

  render() {
    return (
      <FlexLayout justifyContent="space-between">
        <Link className="manage-link"
          onClick={ this.handleShowFsDetailsModal }>
          { this.props.options.entity.name }
        </Link>
        { this.getFailoverFailbackIcon() }
      </FlexLayout>
    );
  }

}

PrimaryFileServersName.propTypes = {
  options: PropTypes.object,
  name: PropTypes.string,
  openModal: PropTypes.func
};

export default PrimaryFileServersName;
