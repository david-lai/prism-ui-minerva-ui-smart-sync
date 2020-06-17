//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// ResumeReplicationActionModal is the Resume Replication Action popup
//
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  BackIcon,
  Button,
  ContainerLayout,
  FlexItem,
  FlexLayout,
  Modal,
  StackingLayout,
  Steps
} from '@nutanix-ui/prism-reactjs';

// Local includes
import AppConstants from '../utils/AppConstants';

import {
  triggerFailover
} from '../actions';

import ResumeReplicationActiveLocationPage from './pages/ResumeReplicationActiveLocationPage.jsx';
import ResumeReplicationDataProtectionPolicyPage from
  './pages/ResumeReplicationDataProtectionPolicyPage.jsx';

import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'ResumeReplicationActionModal', key, defaultValue, replacedValue);

const numCorrespondToUnit = {
  MINUTES : 60,
  HOURLY: 24,
  DAYLY: 7
};

const initialState = {
  stepsData: [
    {
      title: i18nT('choose_active_location', 'Choose Active Location')
    },
    {
      title: i18nT('data_protection_policies', 'Data Protection Policies')
    }
  ],

  selectedLocation: null,

  confirmVisible: false,

  currentStep: 0,

  plannedChecked: true,

  adDomainUsername: '',

  adDomainPassword: '',

  preferredNameServer: '',

  dnsUsername: '',

  dnsPassword: '',

  autoUpdateChecked: true,

  operationType: AppConstants.DNS_UPDATE_TYPE.MS_DNS,

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

  createReverseReplicationPolicy: false,

  rpoPolicyName:'',

  selectedRecoveryInterval: {
    key: '1',
    label: '1'
  }
};

class ResumeReplicationActionModal extends React.Component {

  static propTypes = {
    closeModalAction: PropTypes.func,
    options: PropTypes.object,
    triggerFailover: PropTypes.func,
    onClose: PropTypes.func,
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

  handleKeydown = (e) => {
    if (this.props.options.closeOnEsc && this.props.visible && e.keyCode === 27) {
      this.closeModal(e);
    }
  }

  onStepChange = (e) => {
    if (!isNaN(+e)) {
      this.setState({
        currentStep: e
      });
    }
  }

  handleNextButtonClick = () => {
    if (this.state.currentStep === 1) {
      this.proceedResumeReplication();
    } else {
      this.canGoToNextPage();
    }
  }

  // Make sure the credentials are inputted before enabling failover button
  canProceed() {
    if (this.state.currentStep === 0) {
      return (!!this.state.adDomainUsername && !!this.state.adDomainPassword &&
        !!this.state.preferredNameServer && !!this.state.dnsUsername && !!this.state.dnsPassword);
    }
    return true;
  }

  // Handler for Fallover/Fallback button
  canGoToNextPage = () => {
    if (this.canProceed()) {
      this.goToNextPage();
      // this.proceedFailover();
    } else {
      this.setState({
        confirmVisible: true
      });
    }
  }

  // Event handler for confirm modal proceed
  handleOnConfirm = () => {
    this.setState({
      confirmVisible: false
    });
    this.goToNextPage();
  }

  goToNextPage = () => {
    this.setState({
      currentStep: Math.min(1, this.state.currentStep + 1)
    });
  }

  // Proceed to Resume Replication
  proceedResumeReplication = () => {
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

  handleBackButtonClick = () => {
    this.setState({
      currentStep: Math.max(0, this.state.currentStep - 1)
    });
  }

  // Event handler for FailoverSettingPage Create a Reverse Replication Policy checkbox
  handleReverseReplicationClick = (e) => {
    this.setState({
      createReverseReplicationPolicy: e.target.checked
    });
  }

  // Event handler for ResumeReplicationActiveLocationPage Create a Reverse Replication Policy checkbox
  setLocation = (nextSelectedValue) => {
    this.setState({
      selectedLocation: nextSelectedValue
    });
  }

  // Event handler for RPS schedule selectors
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

  closeModal = (e) => {
    if (this.props.closeModalAction && typeof this.props.closeModalAction === 'function') {
      this.setState({
        ...initialState
      });
      this.props.closeModalAction(e);
      // this.props.options.goToPath(`/${AppConstants.POLICIES_TAB_KEY}`);
    }
  }

  // Make sure the credentials are inputted before enabling next button
  canContinue() {
    if (this.state.selectedLocation) {
      return true;
    }
    return false;
  }

  getPrimaryButtonLabel() {
    if (this.state.currentStep === 1) {
      return i18nT('resume_replication', 'Resume Replication');
    }
    return i18nT('Next', 'Next');
  }

  renderCurrentStep() {
    if (this.state.currentStep === 0) {
      return (
        <ResumeReplicationActiveLocationPage
          setLocation={ this.setLocation }
          handleOnConfirm={ this.handleOnConfirm }
          confirmVisible={ this.state.confirmVisible }
          handleAutoUpdateOnChange={ this.handleAutoUpdateOnChange }
          handleOnClose={ this.handleOnClose }
          inputChanged={ this.inputChanged }
          entity={ this.props.options.entity }
          modalState={ this.state }
        />
      );
    } else if (this.state.currentStep === 1) {
      return (
        <ResumeReplicationDataProtectionPolicyPage
          entity={ this.props.options.entity }
          selectedLocation={ this.state.selectedLocation }
          handleReverseReplicationClick={ this.handleReverseReplicationClick }
          handleSelectChange={ this.handleSelectChange }
          inputChanged={ this.inputChanged }
          modalState={ this.state }
        />
      );
    }
  }

  renderModalFooter() {
    return (
      <FlexLayout justifyContent="space-between">
        <FlexItem flexGrow="0" flexShrink="1">
          <Button
            type="secondary"
            onClick={ this.closeModal }
          >
            { i18nT('Cancel', 'Cancel') }
          </Button>
        </FlexItem>
        <FlexItem alignSelf="flex-end">
          <FlexLayout padding="5px-0px" itemSpacing="5px" alignItems="center">
            { this.state.currentStep === 1 &&
              (
                <Button
                  type="secondary"
                  onClick={ this.handleBackButtonClick }
                >
                  <BackIcon />
                  { i18nT('Back', 'Back') }
                </Button>
              )
            }
            <Button
              type="primary"
              disabled={ !this.canContinue() }
              onClick={ this.handleNextButtonClick }
            >
              { this.getPrimaryButtonLabel() }
            </Button>
          </FlexLayout>
        </FlexItem>
      </FlexLayout>
    );
  }

  render() {
    const modalBodyContent = (
      <FlexLayout
        padding="10px"
        itemSpacing="10px"
        flexDirection="column"
        justifyContent="space-between"
        style={
          {
            height: 'inherit'
          }
        }
      >
        <FlexItem flexGrow="0">
          <Steps
            data={ this.state.stepsData }
            current={ this.state.currentStep }
            onStepChange={ this.onStepChange }
          />
        </FlexItem>
        <FlexItem flexGrow="1" flexShrink="0">
          { this.renderCurrentStep() }
        </FlexItem>
      </FlexLayout>
    );

    return (
      <div>
        <Modal
          visible={ this.props.visible }
          title={ i18nT('resume_replication', 'Resume Replication') }
          footer={ this.renderModalFooter() }
          onClose={ this.props.onClose }
          width={ 850 }
          className="resume_replication_modal"
        >
          <FlexLayout
            className="alert-modal-body"
            itemFlexBasis="100pc"
            padding="20px"
            flexGrow="1"
          >
            <StackingLayout>
              <ContainerLayout backgroundColor="white">
                { modalBodyContent }
              </ContainerLayout>
            </StackingLayout>
          </FlexLayout>
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

  // componentWillReceiveProps(nextProps){
  //   if (nextProps.action !== this.props.action) {
  //     if (nextProps.action === AppConstants.PROTECTED_FILE_SERVERS_ACTIONS.FAILOVER) {
  //       this.setState({
  //         stepsData: [
  //           {
  //             title: i18nT('failoverSettings', 'Failover Settings')
  //           },
  //           {
  //             title: i18nT('ad_dns_config', 'Active Directory and DNS Configuration')
  //           }
  //         ]
  //       })
  //     } else {
  //       this.setState({
  //         stepsData: [
  //           {
  //             title: i18nT('failbackSettings', 'Failback Settings')
  //           },
  //           {
  //             title: i18nT('ad_dns_config', 'Active Directory and DNS Configuration')
  //           }
  //         ]
  //       })
  //     }
  //   }
  // }

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
)(ResumeReplicationActionModal);

