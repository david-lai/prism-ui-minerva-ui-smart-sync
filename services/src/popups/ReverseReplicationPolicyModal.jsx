//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// ReverseReplicationPolicyModal is the Failover Action popup
//
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
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

// import FailoverSettingPage from './pages/FailoverSettingPage.jsx';
import ReverseReplicationPolicyPage from './pages/ReverseReplicationPolicyPage.jsx';

import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'ReverseReplicationPolicyModal', key, defaultValue, replacedValue);

const numCorrespondToUnit = {
  MINUTES : 60,
  HOURLY: 24,
  DAYLY: 7
};

const initialState = {
  recoveryIntervalUnit: [
    {
      key: AppConstants.RECOVERY_INTERVAL_UNIT.MINUTES,
      label: 'Minutes'
    },
    {
      key: AppConstants.RECOVERY_INTERVAL_UNIT.HOURLY,
      label: 'Hours'
    },
    {
      key: AppConstants.RECOVERY_INTERVAL_UNIT.DAYLY,
      label: 'Days'
    }
  ],

  selectedRecoveryIntervalUnit: {
    key: AppConstants.RECOVERY_INTERVAL_UNIT.MINUTES,
    label: 'Minutes'
  },

  createReverseReplicationPolicy: true,

  rpoPolicyName:'',

  selectedRecoveryInterval: {
    key: '1',
    label: '1'
  }
};

class ReverseReplicationPolicyModal extends React.Component {

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
    this.state.recoveryInterval = this.getRecoveryInterval(60);
  }
  // state = {

  //   // stepsData: [
  //   //   {
  //   //     title: i18nT('settings', 'Failover Settings')
  //   //   },
  //   //   {
  //   //     title: i18nT('ad_dns_config', 'Active Directory and DNS Configuration')
  //   //   }
  //   // ],

  //   confirmVisible: false,

  //   currentStep: 0,

  //   createReverseReplicationPolicy: false,

  //   plannedChecked: true,

  //   operationType: AppConstants.DNS_UPDATE_TYPE.MS_DNS
  // }

  handleKeydown = (e) => {
    if (this.props.options.closeOnEsc && this.props.visible && e.keyCode === 27) {
      this.closeModal(e);
    }
  }

  // onStepChange = (e) => {
  //   if (!isNaN(+e)) {
  //     this.setState({
  //       currentStep: e
  //     });
  //   }
  // }

  // handleNextButtonClick = () => {
  //   if (this.state.currentStep === 1) {
  //     this.submitFailover();
  //   } else {
  //     this.setState({
  //       currentStep: Math.min(1, this.state.currentStep + 1)
  //     });
  //   }
  // }

  // Handler for Fallover/Fallback button
  submitFailover = () => {
    // if (this.canContinue()) {
    this.proceedFailover();
    // } else {
    //   this.setState({
    //     confirmVisible: true
    //   });
    // }
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
        ],
        rpoPolicyName: this.state.rpoPolicyName
      };
    }
    this.props.triggerFailover('1234', payload);
    this.closeModal();
  }

  // handleBackButtonClick = () => {
  //   this.setState({
  //     currentStep: Math.max(0, this.state.currentStep - 1)
  //   });
  // }

  // // Event handler for FailoverSettingPage planned/unplanned failover radio button
  // handlePlannedUnplannedOnChange(e) {
  //   this.setState({
  //     type: e
  //   });
  // }

  // Event handler for FailoverSettingPage Create a Reverse Replication Policy checkbox
  handleReverseReplicationClick = (e) => {
    this.setState({
      createReverseReplicationPolicy: e.target.checked
    });
  }

  // Event handler for FailoverSettingPage RPS schedule selectors
  handleSelectChange = (e) => {
    switch (e.key) {
      case AppConstants.RECOVERY_INTERVAL_UNIT.MINUTES:
      case AppConstants.RECOVERY_INTERVAL_UNIT.HOURLY:
      case AppConstants.RECOVERY_INTERVAL_UNIT.DAYLY:
        this.setState({
          selectedRecoveryIntervalUnit: e,
          recoveryInterval: this.getRecoveryInterval(numCorrespondToUnit[e.key])
        });
        // this.props.handleSelectChange(e, this.state.selectedRecoveryInterval.key);
        break;
      default:
        this.setState({
          selectedRecoveryInterval: e
        });
        // this.props.handleSelectChange(e, this.state.selectedRecoveryIntervalUnit.key);
    }
  }

  getRecoveryInterval = (range) => {
    const optionsArray = new Array(range);
    return _.map(optionsArray, (option, index) => {
      return {
        key: (index + 1).toString(),
        label: (index + 1).toString()
      };
    });
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
      // this.props.options.goToPath(`/${AppConstants.POLICIES_TAB_KEY}`);
    }
  }

  // // Make sure the credentials are inputted before enabling failover button
  // canContinue() {
  //   if (this.state.currentStep === 1) {
  //     return (!!this.state.adDomainUsername && !!this.state.adDomainPassword &&
  //       !!this.state.preferredNameServer && !!this.state.dnsUsername && !!this.state.dnsPassword);
  //   }
  //   return true;
  // }

  // getPrimaryButtonLabel() {
  //   if (this.state.currentStep === 1) {
  //     if (this.props.action === AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILOVER) {
  //       return i18nT('failover', 'Failover');
  //     }
  //     return i18nT('failback', 'Failback');
  //   }
  //   return i18nT('Next', 'Next');
  // }

  // renderCurrentStep() {
  //   if (this.state.currentStep === 0) {
  //     return (
  //       <FailoverSettingPage
  //         handlePlannedUnplannedOnChange={ this.handlePlannedUnplannedOnChange }
  //         handleReverseReplicationClick={ this.handleReverseReplicationClick }
  //         handleSelectChange={ this.handleSelectChange }
  //         action={ this.props.action }
  //         entity={ this.props.options.entity }
  //       />
  //     );
  //   } else if (this.state.currentStep === 1) {
  //     return (
  //       <ReverseReplicationPolicyPage
  //         handleAutoUpdateOnChange={ this.handleAutoUpdateOnChange }
  //         inputChanged={ this.inputChanged }
  //         confirmVisible={ this.state.confirmVisible }
  //         handleOnClose={ this.handleOnClose }
  //         handleOnConfirm={ this.handleOnConfirm }
  //       />
  //     );
  //   }
  // }

  // renderModalFooter() {
  //   return (
  //     <FlexLayout justifyContent="space-between">
  //       <FlexItem flexGrow="0" flexShrink="1">
  //         <Button
  //           type="secondary"
  //           onClick={ this.closeModal }
  //         >
  //           { i18nT('Cancel', 'Cancel') }
  //         </Button>
  //       </FlexItem>
  //       <FlexItem alignSelf="flex-end">
  //         <FlexLayout padding="5px-0px" itemSpacing="5px" alignItems="center">
  //           { this.state.currentStep === 1 &&
  //             (
  //               <Button
  //                 type="secondary"
  //                 onClick={ this.handleBackButtonClick }
  //               >
  //                 <BackIcon />
  //                 { i18nT('Back', 'Back') }
  //               </Button>
  //             )
  //           }
  //           <Button
  //             type="primary"
  //             // disabled={ !this.canContinue() }
  //             onClick={ this.handleNextButtonClick }
  //           >
  //             { this.getPrimaryButtonLabel() }
  //           </Button>
  //         </FlexLayout>
  //       </FlexItem>
  //     </FlexLayout>
  //   );
  // }

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
          {i18nT('create_policy', 'Create Policy')}
        </Button>
      </FlexLayout>);
    return (
      <div>
        <Modal
          visible={ this.props.visible }
          title={ i18nT('title', 'Create a Reverse Replication Policy') }
          footer={ footer }
          onClose={ this.closeModal }
          width={ 670 }
          className="reverse_replication_policy_modal"
        >
          <ReverseReplicationPolicyPage
            entity={ this.props.options.entity }
            handleReverseReplicationClick={ this.handleReverseReplicationClick }
            handleSelectChange={ this.handleSelectChange }
            inputChanged={ this.inputChanged }
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
)(ReverseReplicationPolicyModal);

