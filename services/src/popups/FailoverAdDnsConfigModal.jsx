//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// FailoverAdDnsConfigModal is the Failover Action popup
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  FlexLayout,
  Modal
} from '@nutanix-ui/prism-reactjs';

// Local includes
import AppConstants from '../utils/AppConstants';

import {
  triggerFailover
} from '../actions';

import FailoverAdDnsConfigPage from './pages/FailoverAdDnsConfigPage.jsx';

import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FailoverAdDnsConfigModal', key, defaultValue, replacedValue);

const initialState = {
  // stepsData: [
  //   {
  //     title: i18nT('settings', 'Failover Settings')
  //   },
  //   {
  //     title: i18nT('ad_dns_config', 'Active Directory and DNS Configuration')
  //   }
  // ],

  confirmVisible: false,

  // currentStep: 0,

  // createReverseReplicationPolicy: false,

  // plannedChecked: true,

  adDomainUsername: '',

  adDomainPassword: '',

  preferredNameServer: '',

  dnsUsername: '',

  dnsPassword: '',

  autoUpdateChecked: true,

  operationType: AppConstants.DNS_UPDATE_TYPE.MS_DNS
};

class FailoverAdDnsConfigModal extends React.Component {

  static propTypes = {
    closeModalAction: PropTypes.func,
    options: PropTypes.object,
    triggerFailover: PropTypes.func,
    visible: PropTypes.bool
  }

  static defaultProps = {
    options: {
      closeOnEsc: true
    }
  }

  constructor(props, context) {
    super(props, context);
    this.state = initialState;
  }

  handleKeydown = (e) => {
    if (this.props.options.closeOnEsc && this.props.visible && e.keyCode === 27) {
      this.closeModal(e);
    }
  }

  // Handler for Fallover/Fallback button
  submitFailover = () => {
    if (this.canContinue()) {
      this.proceedFailover();
    } else {
      this.setState({
        confirmVisible: true
      });
    }
  }

  // Proceed to fallover/fallback
  proceedFailover = () => {
    const payload = {
      joinDomain: {
        adDomain: {
          domainName: 'string', // change
          username: this.state.adDomainUsername,
          password: this.state.adDomainPassword
        }
      },
      dns: {
        operationType: this.state.operationType,
        preferredNameServer: this.state.preferredNameServer,
        username: this.state.dnsUsername,
        password: this.state.dnsPassword
      }
    };
    if (this.state.createReverseReplicationPolicy) {
      payload.reverseReplication = {
        sourceFileServerExtId: 'string',
        targetFileServerExtId: 'string',
        schedules: [
          {
            multiple: this.state.multiple,
            scheduleType: this.state.scheduleType
          }
        ]
      };
    }
    this.props.triggerFailover('1234', payload);
    this.closeModal();
  }

  // Event handler for AD DNS config update radio button
  handleAutoUpdateOnChange = (e) => {
    this.setState({
      autoUpdateChecked: e === AppConstants.DNS_UPDATE_TYPE.MS_DNS,
      operationType: e
    });
  }

  // Event handler for all of the inputs
  inputChanged = (e) => {
    const id = e.target && e.target.id;
    const value = e.target && e.target.value ? e.target.value : '';
    this.setState({
      [id]: value
    });
  }

  // Event handler for confirm modal close
  handleOnClose = () => {
    this.setState({
      confirmVisible: false
    });
  }

  // Event handler for confirm modal proceed
  handleOnConfirm = () => {
    this.setState({
      confirmVisible: false
    });
    this.proceedFailover();
  }

  closeModal = (e) => {
    if (this.props.closeModalAction && typeof this.props.closeModalAction === 'function') {
      this.setState({
        ...initialState
      });
      this.props.closeModalAction(e);
    }
  }

  // Make sure the credentials are inputted before enabling failover button
  canContinue() {
    return (!!this.state.adDomainUsername && !!this.state.adDomainPassword &&
      !!this.state.preferredNameServer && !!this.state.dnsUsername && !!this.state.dnsPassword);
  }

  render() {
    const footer = (
      <FlexLayout itemSpacing="10px" justifyContent="flex-end">
        <Button
          onClick={ this.closeModal }
          type="secondary"
        >
          {i18nT('close', 'Close')}
        </Button>
        <Button onClick={ this.submitFailover }>
          {i18nT('save', 'Save')}
        </Button>
      </FlexLayout>);
    return (
      <div>
        <Modal
          visible={ this.props.visible }
          title={ i18nT('title', 'Configure AD and DNS Server') }
          footer={ footer }
          onClose={ this.closeModal }
          width={ 800 }
          className="ad_dns_config_modal"
        >
          <FailoverAdDnsConfigPage
            handleAutoUpdateOnChange={ this.handleAutoUpdateOnChange }
            inputChanged={ this.inputChanged }
            confirmVisible={ this.state.confirmVisible }
            handleOnClose={ this.handleOnClose }
            handleOnConfirm={ this.handleOnConfirm }
            modalState={ this.state }
          />
        </Modal>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

}

const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    triggerFailover: (extId, failoverData) => dispatch(triggerFailover(extId, failoverData))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FailoverAdDnsConfigModal);

