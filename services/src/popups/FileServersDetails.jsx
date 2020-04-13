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
  StackingLayout
} from 'prism-reactjs';
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

  constructor(props) {
    super(props);
    this.onOpenPeClick = this.onOpenPeClick.bind(this);
  }

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
      }
    ];

    const footer = (
      <div>
        <Button
          onClick={ this.props.onClose }
          type="secondary">
          {i18nT('done', 'Done')}
        </Button>
        <Button
          type="primary"
          onClick={ this.onOpenPeClick }>
          {i18nT('manage', 'Manage')}
        </Button>
      </div>);

    return (
      <div>
        <Modal
          visible={ this.props.visible }
          title={ i18nT('file_server_details', 'File Server Details') }
          footer={ footer }
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

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.details.entityId &&
      nextProps.details.entityId !== this.props.details.entityId &&
      !nextProps.fsDetails[nextProps.details.entityId]
    ) {
      this.props.fetchFsDetails(nextProps.details.entityId);
    }
    if (
      nextProps.details.cluster_uuid &&
      nextProps.details.cluster_uuid !== this.props.details.cluster_uuid &&
      !nextProps.clusterDetails[nextProps.details.cluster_uuid]
    ) {
      this.props.fetchClusterDetails(nextProps.details.cluster_uuid);
    }
  }

  componentDidMount() {
    const details = this.props.details;
    if (details.entityId && !this.props.fsDetails[details.entityId]) {
      this.props.fetchFsDetails(details.entityId);
    }
    if (details.cluster_uuid && !this.props.clusterDetails[details.cluster_uuid]) {
      this.props.fetchClusterDetails(details.cluster_uuid);
    }
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


FileServersDetails.propTypes = {
  details: PropTypes.object,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  openPe: PropTypes.func,
  fsDetails: PropTypes.object,
  fetchFsDetails: PropTypes.func,
  clusterDetails: PropTypes.object,
  fetchClusterDetails: PropTypes.func
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileServersDetails);
