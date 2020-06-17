//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Create new policy popup
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  BackIcon,
  Button,
  ContainerLayout,
  FlexItem,
  FlexLayout,
  Form,
  FormLayout,
  FormItemInput,
  FullPageModal,
  StackingLayout,
  Steps
} from '@nutanix-ui/prism-reactjs';

// Local includes
import AppConstants from '../utils/AppConstants';
import AppUtil from '../utils/AppUtil';

import FileServerSelector from '../components/policies/FileServerSelector.jsx';
import ReplicationSchedule from '../components/policies/ReplicationSchedule.jsx';

import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'CreateNewPolicyModal', key, defaultValue, replacedValue);


class CreateNewPolicyModal extends React.Component {

  static propTypes = {
    closeModalAction: PropTypes.func,
    options: PropTypes.object,
    visible: PropTypes.bool,
    fsData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
  }

  static defaultProps = {
    options: {
      closeOnEsc: true
    }
  }

  state = {
    stepsData: [
      {
        title: i18nT('Source_and_targets', 'Source and Targets')
      },
      {
        title: i18nT('Settings', 'Settings')
      }
    ],
    currentStep: 0,

    scheduleUnits: {
      sec: {
        multiplier: 1,
        values: [
          10,
          30
        ]
      },
      min: {
        multiplier: 60,
        values: [
          1,
          5,
          10,
          30
        ]
      },

      hr: {
        multiplier: 3600,
        values: [...Array(23).keys()].slice(1)
      },
      day: {
        multiplier: 86400,
        values: [...Array(30).keys()].slice(1)
      },
      week: {
        multiplier: 604800,
        values: [
          1,
          2
        ]
      }
    },

    // data values for policy
    sourceFsEntityId: '',
    targetFsEntityId: '',
    replicationScheduleValue: 10,
    replicationScheduleUnit: 'min',
    policyName: '',
    policyDescription: ''
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
    this.setState({
      currentStep: Math.min(1, this.state.currentStep + 1)
    });
  }

  handleBackButtonClick = () => {
    this.setState({
      currentStep: Math.max(0, this.state.currentStep - 1)
    });
  }

  closeModal = (e) => {
    if (this.props.closeModalAction && typeof this.props.closeModalAction === 'function') {
      this.props.closeModalAction(e);
      this.props.options.goToPath(`/${AppConstants.POLICIES_TAB_KEY}`);
    }
  }

  sourceFsChanged = (entityId) => {
    this.setState({
      sourceFsEntityId: entityId
    });
  }

  targetFsChanged = (entityId) => {
    this.setState({
      targetFsEntityId: entityId
    });
  }

  policyNameChanged = (e) => {
    const value = e.target && e.target.value ? e.target.value : '';
    this.setState({
      policyName: value
    });
  }

  policyDescriptionChanged = (e) => {
    const value = e.target && e.target.value ? e.target.value : '';
    this.setState({
      policyDescription: value
    });
  }

  replicationScheduleChanged = (data) => {
    let value = data.value;
    const unit = data.unit;
    if (this.state.replicationScheduleUnit !== unit) {
      value = this.state.scheduleUnits[unit].values[0];
    }
    this.setState({
      replicationScheduleUnit: unit,
      replicationScheduleValue: value
    });
  }

  canContinue() {
    if (this.state.currentStep === 0) {
      return (!!this.state.sourceFsEntityId && !!this.state.targetFsEntityId);
    }
    return !!this.state.policyName;
  }

  getPrimaryButtonLabel() {
    if (this.state.currentStep === 1) {
      if (!this.props.options.update) {
        return i18nT('Create', 'Create');
      }
      return i18nT('Update', 'Update');
    }
    return i18nT('Next', 'Next');
  }

  renderFirstStep() {
    let fsList = [];
    if (this.props.fsData) {
      fsList = AppUtil.extractGroupResults(this.props.fsData);
    }
    const sourceRowsData = fsList.filter(fsItem => {
      return fsItem.entity_id !== this.state.targetFsEntityId;
    }).map(fsItem => {
      return {
        key: fsItem.entity_id,
        label: fsItem.name
      };
    });

    const targetRowsData = fsList.filter(fsItem => {
      return fsItem.entity_id !== this.state.sourceFsEntityId;
    }).map(fsItem => {
      return {
        key: fsItem.entity_id,
        label: fsItem.name
      };
    });

    return (
      <FlexLayout
        padding="0px-20px"
        alignItems="center"
        justifyContent="space-between"
      >
        <FlexItem
          alignSelf="stretch"
          flexGrow="0"
          flexShrink="0"
        >
          <FileServerSelector
            selectedEntityId={ this.state.sourceFsEntityId }
            selectId="source_fs"
            selectLabel={
              i18nT('Select_file_server', 'Select File Server')
            }
            selectPlaceholder={
              i18nT('Select_source_file_server', 'Select Source File Server')
            }
            title={
              i18nT(
                'Source_file_servers_primary_location',
                'Source File Servers (Primary Location)'
              )
            }
            rowsData={ sourceRowsData }
            onChange={ this.sourceFsChanged }
          />
        </FlexItem>
        <FlexItem
          alignSelf="stretch"
          flexGrow="0"
          flexShrink="0"
        >
          <ReplicationSchedule
            scheduleUnits={ this.state.scheduleUnits }
            replicationScheduleValue={ this.state.replicationScheduleValue }
            replicationScheduleUnit={ this.state.replicationScheduleUnit }
            onChange={ this.replicationScheduleChanged }
          />
        </FlexItem>
        <FlexItem
          alignSelf="stretch"
          flexGrow="0"
          flexShrink="0"
        >
          <FileServerSelector
            selectedEntityId={ this.state.targetFsEntityId }
            selectId="target_fs"
            selectLabel={
              i18nT('Select_file_server', 'Select File Server')
            }
            selectPlaceholder={
              i18nT('Select_target_file_server', 'Select Target File Server')
            }
            title={
              i18nT(
                'Replication_target_recovery_location',
                'Replication target (Recovery Location)'
              )
            }
            rowsData={ targetRowsData }
            onChange={ this.targetFsChanged }
          />
        </FlexItem>
      </FlexLayout>
    );
  }

  renderSecondStep() {
    return (
      <Form
        onSubmit={ this.handleFormSubmit }
      >
        <FormLayout
          padding="0px-20px"
          justifyContent="center"
          flexDirection="column"
          itemSpacing="10px"
          contentWidth="400px"
        >
          <FlexItem>
            <FormItemInput
              id="name"
              label={ i18nT('Name', 'Name') }
              onChange={ this.policyNameChanged }
            />
          </FlexItem>
          <FlexItem>
            <FormItemInput
              id="description"
              label={ i18nT('Description', 'Description') }
              onChange={ this.policyDescriptionChanged }
            />
          </FlexItem>
        </FormLayout>
      </Form>
    );
  }

  renderCurrentStep() {
    if (this.state.currentStep === 0) {
      return this.renderFirstStep();
    } else if (this.state.currentStep === 1) {
      return this.renderSecondStep();
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
        <FlexItem flexGrow="0">
          { this.renderModalFooter() }
        </FlexItem>
      </FlexLayout>
    );

    return (
      <div>
        <FullPageModal
          className="create-new-policy-modal"
          title={ i18nT('Create_a_data_protection_policy', 'Create a Data Protection Policy') }
          visible={ this.props.visible }
          onClose={ this.closeModal }
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
        </FullPageModal>
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

const mapDispatchToProps = null;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewPolicyModal);

