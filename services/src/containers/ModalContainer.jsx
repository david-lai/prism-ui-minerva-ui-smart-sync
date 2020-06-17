//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Container for modal
//

// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeModal } from '../actions';

// Utils includes
import AppConstants, { MODAL_TYPE } from '../utils/AppConstants';

import FileServersDetails from '../popups/FileServersDetails.jsx';
import AlertInfoModal from '../popups/AlertInfoModal.jsx';
import EventInfoModal from '../popups/EventInfoModal.jsx';

import CreateNewPolicyModal from '../popups/CreateNewPolicyModal.jsx';
import FailoverActionModal from '../popups/FailoverActionModal.jsx';
import FailoverAdDnsConfigModal from '../popups/FailoverAdDnsConfigModal.jsx';
import ReverseReplicationPolicyModal from '../popups/ReverseReplicationPolicyModal.jsx';
import ResumeReplicationActionModal from '../popups/ResumeReplicationActionModal.jsx';

/**
 * Class represents Header Container
 * @class
 * @extends HulkComponent
*/
class ModalContainer extends React.Component {

  static propTypes = {
    /**
     * Any options related to the target modal component
     */
    options: PropTypes.object,
    /**
     * value that indicates wheter or not the modal is visible
     */
    visible: PropTypes.bool
    /**
     * modal type that will be shown
     */
  }

  render() {
    const {
      options = {},
      visible,
      type
    } = this.props.modals;
    const {
      closeModal: close
    } = this.props;

    if (type === MODAL_TYPE.FILE_SERVER_DETAILS) {
      const { entity: details, openPe } = options;
      return (
        <FileServersDetails
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          details={ details }
          openPe={ openPe }
        />
      );
    } else if (type === MODAL_TYPE.ALERT_INFO) {
      return (
        <AlertInfoModal
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          alert={ options.entity }
          alertList={ this.props.alertList }
        />
      );
    } else if (type === MODAL_TYPE.EVENT_INFO) {
      return (
        <EventInfoModal
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          options={ options }
        />
      );
    } else if (type === MODAL_TYPE.CREATE_NEW_POLICY) {
      return (
        <CreateNewPolicyModal
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          options={ options }
        />
      );
    } else if (type === MODAL_TYPE.FAILOVER) {
      let action = 'failvoer';
      const {
        owner_fs_uuid: ownerFsUuid,
        primary_fs_uuid: primaryFsUuid,
        status
      } = options.entity;
      if (ownerFsUuid === primaryFsUuid && status === '1') {
        action = AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILOVER;
      } else {
        action = AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILBACK;
      }
      return (
        <FailoverActionModal
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          action={ action }
          options={ options }
        />
      );
    } else if (type === MODAL_TYPE.FAILOVER_AD_DNS_CONFIG) {
      let action = 'failvoer';
      const {
        owner_fs_uuid: ownerFsUuid,
        primary_fs_uuid: primaryFsUuid,
        status
      } = options.entity;
      if (ownerFsUuid === primaryFsUuid && status === '1') {
        action = AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILOVER;
      } else {
        action = AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILBACK;
      }
      return (
        <FailoverAdDnsConfigModal
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          action={ action }
          options={ options }
        />
      );
    } else if (type === MODAL_TYPE.RESUME_REPLICATION) {
      let action = 'failvoer';
      const {
        owner_fs_uuid: ownerFsUuid,
        primary_fs_uuid: primaryFsUuid,
        status
      } = options.entity;
      if (ownerFsUuid === primaryFsUuid && status === '1') {
        action = AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILOVER;
      } else {
        action = AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILBACK;
      }
      return (
        <ResumeReplicationActionModal
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          action={ action }
          options={ options }
        />
      );
    } else if (type === MODAL_TYPE.CREATE_REVERSE_REPLICATION_POLICY) {
      return (
        <ReverseReplicationPolicyModal
          closeModalAction={ close }
          visible={ visible }
          onClose={ options.onClose || close }
          options={ options }
        />
      );
    }
    return null;
  }

}

const mapStateToProps = state => {
  return {
    modals: state.modals,
    alertList: state.groupsapi.alertList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: () => dispatch(closeModal())
  };
};

ModalContainer.propTypes = {
  options: PropTypes.object,
  visible: PropTypes.bool,
  type: PropTypes.string,
  modals: PropTypes.object,
  alertList: PropTypes.array,
  closeModal: PropTypes.func
};

ModalContainer.defaultProps = {
  alertList: []
};


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalContainer);
