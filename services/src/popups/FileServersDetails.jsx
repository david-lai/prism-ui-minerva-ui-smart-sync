//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers details popup
//
import React from 'react';
import { connect } from 'react-redux';
import {
  Modal,
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

  render() {
    const details = this.props.details;
    let entity = {
      name: '',
      afs_version: '',
      nvm_uuid_list: '',
      ipv4_address: ''
    };
    if (this.props.fsDetails[details.entityId]) {
      entity = this.props.fsDetails[details.entityId];
    }

    let cluster = {
      cluster_name: ''
    };
    if (this.props.clusterDetails[details.cluster_uuid]) {
      cluster = this.props.clusterDetails[details.cluster_uuid];
    }
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
        title: i18nT('fs_name', 'File Server Name'),
        data: entity.name
      },
      {
        key: 'cluster',
        title: i18nT('cluster_name', 'Cluster'),
        data: cluster.cluster_name
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
    return (
      <div>
        <Modal
          visible={ this.props.visible }
          title={ i18nT('file_server_details', 'File Server Details') }
          primaryButtonLabel="Done"
          primaryButtonClick={ this.props.onClose }
          onCancel={ this.props.onClose }
        >
          <StackingLayout padding="20px">
            <Table
              structure={
                {
                  hideHeader:true
                }
              }
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

  fsDetails: PropTypes.object,
  fetchFsDetails: PropTypes.func,
  clusterDetails: PropTypes.object,
  fetchClusterDetails: PropTypes.func
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileServersDetails);
