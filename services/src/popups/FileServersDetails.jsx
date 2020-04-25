//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers details popup
//
import React from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Button,
  Table,
  OpenInNewWindowIcon,
  Link,
  StackingLayout
} from '@nutanix-ui/prism-reactjs';
import PropTypes from 'prop-types';
import i18n from '../utils/i18n';

// Actions
import {
  fetchClusterDetails,
  fetchFsDetails
} from '../actions';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServersDetails', key, defaultValue, replacedValue);

class FileServersDetails extends React.Component {

  static propTypes = {
    details: PropTypes.object,
    onClose: PropTypes.func,
    visible: PropTypes.bool,
    openPe: PropTypes.func,
    fsDetails: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    fetchFsDetails: PropTypes.func,
    clusterDetails: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    fetchClusterDetails: PropTypes.func
  };


  /**
   * Get derived state from props lifecycle method
   *
   * This method checks for 'visible' prop change and fetches
   * the data if it is set to 'true'.
   *
   * @param  {Object} props Current props
   * @param  {Object} state Current state
   * @return {Object}       Derived state
   */
  static getDerivedStateFromProps(props, state) {
    let changed = false;
    const changes = {};
    if (props.visible !== state.currentlyVisible) {
      changed = true;
      changes.currentlyVisible = props.visible;
    }
    if (changed) {
      const details = props.details;
      if (details.entityId && !props.fsDetails[details.entityId]) {
        props.fetchFsDetails(details.entityId);
      }
      if (details.cluster_uuid && !props.clusterDetails[details.cluster_uuid]) {
        props.fetchClusterDetails(details.cluster_uuid);
      }
      return changes;
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.onOpenPeClick = this.onOpenPeClick.bind(this);
  }

  state = {
    currentlyVisible: false
  };

  // Event handler for manage button to open PE
  onOpenPeClick() {
    const clusterUuid = this.props.details.cluster_uuid;
    this.props.openPe(clusterUuid);
  }

  render() {
    const details = this.props.details;

    const entity = {
      name: '',
      afs_version: '',
      nvm_uuid_list: '',
      ipv4_address: '',
      last_used_size_bytes: '',
      cluster_name: ''
    };
    if (details) {
      if (details.name) {
        entity.name = details.name;
      }
      if (details.afs_version) {
        entity.afs_version = details.afs_version;
      }
      if (details.nvm_uuid_list) {
        entity.nvm_uuid_list = details.nvm_uuid_list;
      }
    }
    if (this.props.fsDetails[details.entityId]) {
      const fsd = this.props.fsDetails[details.entityId];
      if (fsd.ipv4_address) {
        entity.ipv4_address = fsd.ipv4_address;
      }
      if (fsd.last_used_size_bytes) {
        entity.last_used_size_bytes = fsd.last_used_size_bytes;
      }
    }

    if (this.props.clusterDetails[details.cluster_uuid]) {
      entity.cluster_name = this.props.clusterDetails[details.cluster_uuid].cluster_name;
    }

    const loadingError = !(
      typeof this.props.fsDetails[details.entityId] !== 'boolean' &&
      typeof this.props.clusterDetails[details.cluster_uuid] !== 'boolean'
    );

    const loading = !(
      this.props.fsDetails[details.entityId] &&
      this.props.clusterDetails[details.cluster_uuid]
    );

    const columns = [{
      title: '',
      key: 'title'
    }, {
      title: '',
      key: 'data'
    }];

    const manage = (
      <Link
        onClick={ this.onOpenPeClick }
        className="fs-manage"
      >
        <OpenInNewWindowIcon />
      </Link>);

    const data = [
      {
        key: 'name',
        title: i18nT('name', 'File Server Name'),
        data: entity.name
      },
      {
        key: 'cluster',
        title: i18nT('cluster_name', 'Cluster'),
        data: entity.cluster_name
      },
      {
        key: 'version',
        title: i18nT('verion', 'Version'),
        data: entity.afs_version.split('-')[0]
      },
      {
        key: 'vms',
        title: i18nT('fs_vms', 'File Server VMs'),
        data: entity.nvm_uuid_list.split(',').length || 0
      },
      {
        key: 'ips',
        title: i18nT('external_ip_addresses', 'External IP Addresses'),
        data: entity.ipv4_address
      },
      {
        key: 'manage',
        title: i18nT('manage', 'Manage'),
        data: manage
      }
    ];

    const footer = (
      <Button
        onClick={ this.props.onClose }
        type="secondary">
        {i18nT('close', 'Close')}
      </Button>);
    return (
      <div>
        <Modal
          visible={ this.props.visible }
          title={ i18nT('file_server_details', 'File Server Details') }
          footer={ footer }
          onClose={ this.props.onClose }
        >
          <StackingLayout padding="20px">
            <Table
              structure={
                {
                  hideHeader:true
                }
              }
              loadingError={ loadingError }
              loading={ loading }
              oldTable={ false }
              dataSource={ data }
              columns={ columns } />
          </StackingLayout>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fsDetails: state.groupsapi.fsDetails,
    clusterDetails: state.groupsapi.clusterDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchClusterDetails: (entityId) => dispatch(fetchClusterDetails(entityId)),
    fetchFsDetails: (entityId) => dispatch(fetchFsDetails(entityId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileServersDetails);
