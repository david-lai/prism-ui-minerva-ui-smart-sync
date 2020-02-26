//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers details popup
//
import React from 'react';
import { Modal, Button, Table, StackingLayout } from 'prism-reactjs';
import PropTypes from 'prop-types';

// Local includes
import i18n from '../utils/i18n';

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
    const {
      name,
      afs_version : version,
      nvm_uuid_list : vms
    } = this.props.details;

    const columns = [{
      title: '',
      key: 'title'
    }, {
      title: '',
      key: 'data'
    }];

    const data = [{
      key: '1',
      title: i18nT('fs_name', 'File Server Name'),
      data: name
    }, {
      key: '2',
      title: i18nT('verion', 'Version'),
      data: version.split('-')[0]
    }, {
      key: '3',
      title: i18nT('fs_vms', 'File Server VMs'),
      data: vms.split(',').length || 0
    }, {
      key: '4',
      title: i18nT('external_ip_addresses', 'External IP Addresses'),
      data: 'na'
    }];

    const footer = (
      <div>
        <Button
          type="primary"
          onClick={ this.onOpenPeClick }>
          {i18nT('manage', 'Manage')}
        </Button>
        <Button
          onClick={ this.props.onClose }
          type="secondary">
          {i18nT('done', 'Done')}
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
            <Table structure={ { hideHeader:true } } oldTable={ false } dataSource={ data }
              columns={ columns } />
          </StackingLayout>
        </Modal>
      </div>
    );
  }
}

FileServersDetails.propTypes = {
  details: PropTypes.object,
  onClose: PropTypes.func,
  openPe: PropTypes.func,
  visible: PropTypes.bool,
  afs_version: PropTypes.string,
  nvm_uuid_list: PropTypes.string
};

export default FileServersDetails;
