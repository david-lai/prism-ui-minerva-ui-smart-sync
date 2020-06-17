//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// FailoverConfirmModal is the Active Directory and DNS Configuration confirmation modal for
// Failover Action popup
//
import React from 'react';
import PropTypes from 'prop-types';
import { ConfirmModal, Button } from '@nutanix-ui/prism-reactjs';

import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FailoverConfirmModal', key, defaultValue, replacedValue);

class FailoverConfirmModal extends React.Component {

  static propTypes = {
    handleOnClose: PropTypes.func,
    handleOnConfirm: PropTypes.func,
    confirmVisible: PropTypes.bool
  }

  render() {
    return (
      <ConfirmModal
        visible={ this.props.confirmVisible }
        header={ i18nT('modal_title', 'modal_title') }
        footer={ [
          <Button
            key="cancel"
            type="secondary"
            onClick={ this.props.handleOnClose }>
            { i18nT('cancel', 'Cancel') }
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={ this.props.handleOnConfirm }>
            { i18nT('proceed', 'Proceed') }
          </Button>
        ] }
      >
        { i18nT('modal_msg', 'modal_msg') }
      </ConfirmModal>
    );
  }

}

export default FailoverConfirmModal;

