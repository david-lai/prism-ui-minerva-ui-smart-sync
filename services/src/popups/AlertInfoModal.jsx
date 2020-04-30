//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers alert popup
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  CloseIcon,
  ContainerLayout,
  Divider,
  FlexItem,
  FlexLayout,
  FullPageModal,
  HeaderFooterLayout,
  Loader,
  TextGroup,
  Select,
  StackingLayout,
  TextLabel,
  Title
} from '@nutanix-ui/prism-reactjs';

// Local includes
import FormatterUtil from '../utils/FormatterUtil';

import FakeProgress from '../components/ui/FakeProgress.jsx';

import i18n from '../utils/i18n';

// Actions
import {
  fetchAlertModalInfo,
  resolveAlert,
  acknowledgeAlert,
  setAlertRequestType,
  setAlertRequestStatus
} from '../actions';


// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'AlertInfoModal', key, defaultValue, replacedValue);


class AlertInfoModal extends React.Component {

  static propTypes = {
    visible: PropTypes.bool,
    closeModalAction: PropTypes.func,
    alertModalLoading: PropTypes.bool,
    alertRequestActive: PropTypes.bool,
    alertRequestStatus: PropTypes.bool,
    alertRequestType: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    alertInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    alertList: PropTypes.array,
    // eslint-disable-next-line react/no-unused-prop-types
    fetchAlertModalInfo: PropTypes.func,
    setAlertRequestStatus: PropTypes.func,
    setAlertRequestType: PropTypes.func,
    resolveAlert: PropTypes.func,
    acknowledgeAlert: PropTypes.func
  };


  static getDerivedStateFromProps(props, state) {
    let changed = false;
    const stateChanges = {};
    const { inputProps } = state;

    if (!props.visible) {
      // modal is benng closed, reset data
      changed = true;
      inputProps.value = '';
      stateChanges.alertSearch = '';
      stateChanges.inputProps = inputProps;
      stateChanges.ready = false;
      stateChanges.alertId = 0;
      stateChanges.alertObject = null;
      stateChanges.alertInfo = null;
      stateChanges.selectedRow = null;
    } else {
      if (!state.alertObject) {
        // no local data
        if (props.alert && props.alert.entityId) {
          // first time opening - populate alertObject in state
          changed = true;
          inputProps.value = '';
          stateChanges.ready = false;
          stateChanges.inputProps = inputProps;
          stateChanges.alertId = props.alert.entityId;
          stateChanges.alertObject = props.alert;
          stateChanges.alertSearch = '';
          stateChanges.selectedRow = {
            id: props.alert.entityId,
            key: props.alert.entityId,
            label: props.alert.title
          };
          stateChanges.alertInfo = null;
          props.fetchAlertModalInfo(props.alert.entityId);
        }
      } else if (state.alertObject.entityId !== state.alertId) {
        // Alert id has been changed, apply new data
        changed = true;
        inputProps.value = '';
        stateChanges.inputProps = inputProps;
        stateChanges.alertObject = null;
        stateChanges.alertSearch = '';
        stateChanges.alertInfo = null;
        stateChanges.selectedRow = null;
        stateChanges.ready = false;
        props.fetchAlertModalInfo(state.alertId);
      }

      if (
        (
          !state.alertInfo && props.alertInfo
        ) ||
        (
          state.alertInfo && props.alertInfo &&
          state.alertInfo.entityId !== props.alertInfo.entity.entityId
        )
      ) {
        // We have new data in props but old in state
        changed = true;
        stateChanges.alertInfo = props.alertInfo.entity;
        inputProps.value = '';
        stateChanges.selectedRow = {
          id: props.alertInfo.entity.entityId,
          key: props.alertInfo.entity.entityId,
          label: props.alertInfo.entity.title
        };
        stateChanges.ready = true;
        stateChanges.inputProps = inputProps;
        stateChanges.alertSearch = '';
      }
    }

    if (changed) {
      return stateChanges;
    }
    return null;
  }

  state = {
    alertId: 0,
    alertObject: {},
    alertInfo: null,
    selectRowsData: [],
    selectedRow: null,
    alertSearch: '',
    inputProps: {
      value: '',
      onChange: null,
      onFocus: null
    },
    ready: false
  }

  frame = null

  constructor(props, context) {
    super(props, context);

    this.state.inputProps.onChange = this.handleSelectSearchChange;
    this.state.inputProps.onFocus = this.handleSelectSearchFocus;
  }

  handleKeydown = (e) => {
    if (this.props.visible && e.keyCode === 27) {
      this.closeModal(e);
    }
  }

  handleCloseClick = (e) => {
    e.preventDefault();
    this.closeModal(e);
  }

  handleResolveClick = (e) => {
    e.preventDefault();
    this.props.resolveAlert(this.state.alertId);
  }

  handleAcknowledgeClick = (e) => {
    this.props.acknowledgeAlert(this.state.alertId);
  }

  handleSelectSearchFocus = (e) => {
    if (e && e.target && e.target.select) {
      e.target.select();
      if (
        this.state.selectedRow &&
        this.state.selectedRow.label &&
        e.target.value === this.state.selectedRow.label
      ) {
        e.target.value = '';
      }
    }
  }

  handleSelectSearchChange = (e) => {
    const { value } = e.currentTarget;
    const { inputProps } = this.state;
    inputProps.value = value;
    this.setState({
      alertSearch: value,
      inputProps
    });
  }


  handleOnSelectedChange = (row) => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    const { inputProps } = this.state;
    inputProps.value = '';
    this.setState({
      selectedRow: row,
      alertId: row.key,
      inputProps,
      alertSearch: ''
    });
  }

  closeModal(e) {
    if (this.props.closeModalAction && typeof this.props.closeModalAction === 'function') {
      this.props.closeModalAction(e);
    }
  }

  prepareAlertData() {
    let defaultValue = i18nT('N/A', 'N/A');
    if (this.props.alertModalLoading) {
      defaultValue = (<Loader key="defaultValue" />);
    }
    const alertData = {
      title: defaultValue,
      description: defaultValue,
      createdLabel: defaultValue,
      lastOccuredLabel: defaultValue,
      severity: {
        color: Badge.BADGE_COLOR_TYPES.GRAY,
        label: defaultValue
      },
      impactType: defaultValue,
      sourceEntity: defaultValue,
      status: {
        acknowledged: false,
        resolved: false,
        statusLabel: '',
        autoResolved: false,
        resolvedBy: defaultValue,
        acknowledgedBy: defaultValue
      },
      possibleCauses: [
        defaultValue
      ],
      resolutions: [
        defaultValue
      ]
    };

    if (!this.props.alertModalLoading && this.state.alertInfo) {
      const alertInfo = this.state.alertInfo;

      if (alertInfo) {
        alertData.description = this.populateDefaultMessage(
          alertInfo.default_message,
          alertInfo.parameters
        );
        if (alertInfo.impact_type_list && alertInfo.impact_type_list.length) {
          alertData.impactType = FormatterUtil.separatePascalCase(
            alertInfo.impact_type_list.join(' ')
          );
        }
        if (alertInfo.title) {
          alertData.title = alertInfo.title;
        }
        if (
          alertInfo.source_entity &&
          alertInfo.source_entity.entity &&
          alertInfo.source_entity.entity.name
        ) {
          alertData.sourceEntity = alertInfo.source_entity.entity.name;
        }

        if (alertInfo.severity === 'info') {
          alertData.severity.color = Badge.BADGE_COLOR_TYPES.GRAY;
          alertData.severity.label = i18nT('alert_severity_info', 'Info');
        } else if (alertInfo.severity === 'warning') {
          alertData.severity.color = Badge.BADGE_COLOR_TYPES.YELLOW;
          alertData.severity.label = i18nT('alert_severity_warning', 'Warning');
        } else if (alertInfo.severity === 'critical') {
          alertData.severity.color = Badge.BADGE_COLOR_TYPES.RED;
          alertData.severity.label = i18nT('alert_severity_critical', 'Critical');
        }
      }

      const createdMoment = moment(alertInfo.creation_time);
      const loMoment = moment(alertInfo.latest_occurrence_time);
      alertData.createdLabel = createdMoment.format('MM/DD/YY h:m:s A');
      alertData.lastOccuredLabel = loMoment.format('MM/DD/YY h:m:s A');


      alertData.possibleCauses = this.getPossibleCauses();
      alertData.resolutions = this.getResolutionList();

      const resolvedStatus = alertInfo.resolution_status;
      if (resolvedStatus) {
        if (resolvedStatus.is_true) {
          alertData.status.resolved = true;
          if (resolvedStatus.is_auto_resolved) {
            alertData.status.statusLabel = i18nT('Auto_resolved', 'Auto Resolved');
            alertData.status.autoResolved = true;
          } else {
            if (resolvedStatus.user) {
              alertData.status.resolvedBy = resolvedStatus.user;
            }
            alertData.status.statusLabel = i18nT('Resolved', 'Resolved');
          }
        }
      }

      const acknowledgedStatus = alertInfo.acknowledged_status;
      if (acknowledgedStatus) {
        if (acknowledgedStatus.is_true) {
          alertData.status.acknowledged = true;
          if (acknowledgedStatus.user) {
            alertData.status.acknowledgedBy = acknowledgedStatus.user;
          }
          if (!alertData.status.statusLabel) {
            alertData.status.statusLabel = i18nT('Acknowledged', 'Acknowledged');
          }
        }
      }
      if (!alertData.status.statusLabel) {
        alertData.status.statusLabel = defaultValue;
      }
    }
    return alertData;
  }

  populateDefaultMessage = (message, parameters) => {
    return message.replace(/(\{[^}]+\})/g, (propVar) => {
      const propName = propVar.replace(/[{}]/g, '');
      let propValue = '';
      if (
        parameters &&
        parameters[propName] &&
        parameters[propName].string_value
      ) {
        propValue = parameters[propName].string_value;
      }
      return propValue;
    });
  }

  getPossibleCauses() {
    let possibleCauses;
    const possibleCauseList = [];
    if (this.state.alertInfo) {
      if (
        this.state.alertInfo.possible_cause_list &&
        this.state.alertInfo.possible_cause_list.length
      ) {
        const lists = this.state.alertInfo.possible_cause_list;
        possibleCauseList.push(
          ...lists.reduce((acc, val) => {
            if (val && val.cause_list && val.cause_list.length) {
              acc.push(...val.cause_list);
            }
            return acc;
          }, [])
        );
      }
    }
    if (possibleCauseList.length) {
      possibleCauses = (
        <TextGroup>
          {
            possibleCauseList.map((p, i) => {
              return (
                <TextLabel key={ `cause_${i}` } type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { p }
                </TextLabel>
              );
            })
          }
        </TextGroup>
      );
    } else if (this.props.alertModalLoading) {
      possibleCauses = (
        <Loader />
      );
    } else {
      possibleCauses = (
        <TextGroup>
          <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
            { i18nT('N/A', 'N/A') }
          </TextLabel>
        </TextGroup>
      );
    }
    return possibleCauses;
  }

  getResolutionList() {
    let resolutions;
    const resolutionList = [];
    if (this.state.alertInfo) {
      if (
        this.state.alertInfo.possible_cause_list &&
        this.state.alertInfo.possible_cause_list.length
      ) {
        const lists = this.state.alertInfo.possible_cause_list;
        resolutionList.push(
          ...lists.reduce((acc, val) => {
            if (val && val.cause_list && val.resolution_list.length) {
              acc.push(...val.resolution_list);
            }
            return acc;
          }, [])
        );
      }
    }
    if (resolutionList.length) {
      resolutions = (
        <TextGroup>
          {
            resolutionList.map((p, i) => {
              return (
                <TextLabel key={ `cause_${i}` } type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { p }
                </TextLabel>
              );
            })
          }
        </TextGroup>
      );
    } else if (this.props.alertModalLoading) {
      resolutions = (
        <Loader />
      );
    } else {
      resolutions = (
        <TextGroup>
          <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
            { i18nT('Contact_nutanix_support', 'Contact Nutanix Support') }
          </TextLabel>
        </TextGroup>
      );
    }
    return resolutions;
  }

  getSelectRows() {
    let data = [];
    if (this.state.selectedRow) {
      data.push(this.state.selectedRow);
    }

    if (this.props.alertList && this.props.alertList.length) {
      data = this.props.alertList.map((al, index) => {
        return {
          key: al.entity_id,
          id: al.entity_id,
          label: al.title
        };
      });
    }
    if (this.state.alertSearch) {
      const re = new RegExp(this.state.alertSearch.replace(/\//g, '\\/'), 'ig');
      data = data.filter(item => {
        return re.test(item.label);
      });
    }
    return data;
  }

  renderAlertSelector() {
    let data = this.getSelectRows();
    const inputProps = {
      ...{},
      ...this.state.inputProps
    };
    let selectedRow = this.state.selectedRow;
    if (this.props.alertModalLoading || this.props.alertRequestActive) {
      inputProps.disabled = true;
      selectedRow = {
        ...{},
        ...this.state.selectedRow,
        label: i18nT('Loading', 'Loading')
      };
      data = [
        selectedRow
      ];
    }
    return (
      <div className="entity-selector-wrapper">
        <Select
          className="entity-selector-field"
          dropdownMatchSelectWidth={ false }
          searchable={ true }
          label={ i18nT('alerts', 'Alerts') }
          rowsData={ data }
          inputProps={ inputProps }
          onSelectedChange={ this.handleOnSelectedChange }
          selectedRow={ selectedRow }
          getPopupContainer={ () => document.querySelector('.entity-selector-list-wrapper') }
        />
        <div className="entity-selector-list-wrapper" />
      </div>
    );
  }

  renderHeaderActions() {
    return (
      <FlexLayout
        itemSpacing="0px"
        alignItems="center"
        justifyContent="space-between"
      >
        <FlexItem>
          { this.renderAlertSelector() }
        </FlexItem>
        <FlexItem
          className="alert-modal-actions"
        >
          <ButtonGroup>
            <Button
              type="secondary"
              style={
                {
                  width: '80px'
                }
              }
              onClick={ this.handleResolveClick }
              disabled={
                !this.state.ready ||
                this.props.alertModalLoading ||
                this.props.alertRequestActive ||
                this.props.alertRequestType !== ''
              }
            >
              {
                !this.props.alertRequestActive &&
                this.props.alertRequestType === 'resolve' &&
                this.props.alertRequestStatus === true &&
                (
                  i18nT('Success', 'Success')
                )
              }
              {
                !this.props.alertRequestActive &&
                this.props.alertRequestType === 'resolve' &&
                this.props.alertRequestStatus === false &&
                (
                  i18nT('Failed', 'Failed')
                )
              }
              {
                this.props.alertRequestType !== 'resolve' &&
                (
                  i18nT('Resolve', 'Resolve')
                )
              }
              {
                this.props.alertRequestActive &&
                this.props.alertRequestType === 'resolve' &&
                (
                  <Loader />
                )
              }
            </Button>
            <Button
              type="secondary"
              style={
                {
                  width: '115px'
                }
              }
              onClick={ this.handleAcknowledgeClick }
              disabled={
                !this.state.ready ||
                this.props.alertModalLoading ||
                this.props.alertRequestActive ||
                this.props.alertRequestType !== ''
              }
            >
              {
                !this.props.alertRequestActive &&
                this.props.alertRequestType === 'acknowledge' &&
                this.props.alertRequestStatus === true &&
                (
                  i18nT('Success', 'Success')
                )
              }
              {
                !this.props.alertRequestActive &&
                this.props.alertRequestType === 'acknowledge' &&
                this.props.alertRequestStatus === false &&
                (
                  i18nT('Failed', 'Failed')
                )
              }
              {
                this.props.alertRequestType !== 'acknowledge' &&
                (
                  i18nT('Acknowledge', 'Acknowledge')
                )
              }
              {
                this.props.alertRequestActive &&
                this.props.alertRequestType === 'acknowledge' &&
                (
                  <Loader />
                )
              }
            </Button>
          </ButtonGroup>
          <Button
            type="borderless"
            onClick={ this.handleCloseClick }
          >
            <CloseIcon />
          </Button>
        </FlexItem>
      </FlexLayout>
    );
  }

  render() {
    const alertData = this.prepareAlertData();
    const footer = (
      <div />
    );
    let leftPanel = (
      <StackingLayout className="loader-center-wrapper">
        <Loader overlay={ true } tip={ i18nT('Loading', 'Loading') } />
      </StackingLayout>
    );
    let modalHeaderContent = (
      <StackingLayout padding="10px">
        <Title size="h2">
          { i18nT('Loading', 'Loading') }
        </Title>
      </StackingLayout>
    );

    let modalBodyContent = (
      <StackingLayout className="loader-center-wrapper">
        <Loader overlay={ true } tip={ i18nT('Loading', 'Loading') } />
      </StackingLayout>
    );


    if (this.state.ready) {
      leftPanel = (
        <StackingLayout itemSpacing="20px">
          <StackingLayout itemSpacing="5px">
            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Source_entity', 'Source Entity') }
                </TextLabel>
              </FlexItem>
              <FlexItem>
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { alertData.sourceEntity }
                </TextLabel>
              </FlexItem>
            </FlexLayout>

            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Severity', 'Severity') }
                </TextLabel>
              </FlexItem>
              <FlexItem>
                <Badge color={ alertData.severity.color } text={ alertData.severity.label } />
              </FlexItem>
            </FlexLayout>

            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Created_time', 'Created Time') }
                </TextLabel>
              </FlexItem>
              <FlexItem
                style={
                  {
                    textAlign: 'right'
                  }
                }
              >
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { alertData.createdLabel }
                </TextLabel>
              </FlexItem>
            </FlexLayout>

            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Last_occurred', 'Last Occured') }
                </TextLabel>
              </FlexItem>
              <FlexItem
                style={
                  {
                    textAlign: 'right'
                  }
                }
              >
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { alertData.lastOccuredLabel }
                </TextLabel>
              </FlexItem>
            </FlexLayout>

            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Impact_type', 'Impact Type') }
                </TextLabel>
              </FlexItem>
              <FlexItem>
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { alertData.impactType }
                </TextLabel>
              </FlexItem>
            </FlexLayout>

            <FlexLayout padding="5px" itemSpacing="10px" style={ { display: 'none' } }>
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Policy', 'Policy') }
                </TextLabel>
              </FlexItem>
              <FlexItem>
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  -
                </TextLabel>
              </FlexItem>
            </FlexLayout>

            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Status', 'Status') }
                </TextLabel>
              </FlexItem>
              <FlexItem>
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { alertData.status.statusLabel }
                </TextLabel>
              </FlexItem>
            </FlexLayout>

            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Acknowledged_by', 'Acknowledged By') }
                </TextLabel>
              </FlexItem>
              <FlexItem>
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { alertData.status.acknowledgedBy }
                </TextLabel>
              </FlexItem>
            </FlexLayout>

            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('Resolved_by', 'Resolved By') }
                </TextLabel>
              </FlexItem>
              <FlexItem>
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { alertData.status.resolvedBy }
                </TextLabel>
              </FlexItem>
            </FlexLayout>

          </StackingLayout>
        </StackingLayout>
      );

      modalHeaderContent = (
        <StackingLayout padding="10px">
          <Title size="h2">
            { i18nT('Alert_details', 'Alert Details') }
          </Title>
        </StackingLayout>
      );

      modalBodyContent = (
        <StackingLayout
          itemSpacing="10px"
          style={
            {
              width: '100%'
            }
          }>
          <StackingLayout padding="10px">
            <Title size="h3">
              { i18nT('Title', 'Title') }
            </Title>
            <StackingLayout padding="10px">
              { alertData.title }
            </StackingLayout>
          </StackingLayout>
          <StackingLayout padding="10px">
            <Title size="h3">
              { i18nT('Description', 'Description') }
            </Title>
            <StackingLayout padding="10px">
              { alertData.description }
            </StackingLayout>
          </StackingLayout>

          <Divider />

          <StackingLayout padding="10px">
            <Title size="h3">
              { i18nT('Possible_cause', 'Possible Cause') }
            </Title>
            <StackingLayout padding="10px">
              { alertData.possibleCauses }
            </StackingLayout>
          </StackingLayout>

          <Divider />

          <StackingLayout padding="10px">
            <Title size="h3">
              { i18nT('Recommendations', 'Recommendations') }
            </Title>
            <StackingLayout padding="10px">
              <TextGroup>
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { alertData.resolutions }
                </TextLabel>
              </TextGroup>
            </StackingLayout>
          </StackingLayout>
        </StackingLayout>
      );
    }
    return (
      <div>

        <FullPageModal
          className="alert-info-modal"
          visible={ this.props.visible }
          footer={ footer }
          headerActions={
            this.renderHeaderActions()
          }
        >
          <FlexLayout itemSpacing="0px">
            <FakeProgress
              className="modal-progress"
              percent={ 20 }
              showProgress={ !this.state.ready }
            />
            <FlexLayout padding="20px" flexShrink="0" style={
              {
                flexBasis: '240px'
              }
            }>
              { leftPanel }
            </FlexLayout>

            <FlexLayout
              className="alert-modal-body"
              itemFlexBasis="100pc"
              padding="20px"
              flexGrow="1"
            >
              <StackingLayout>
                <ContainerLayout backgroundColor="white">
                  {
                    !this.props.alertRequestActive &&
                    this.props.alertRequestType !== '' &&
                    this.props.alertRequestStatus === true &&
                    (
                      <Alert
                        type={ Alert.TYPE.SUCCESS }
                        showCloseIcon={ false }
                        message={
                          this.props.alertRequestType === 'resolve'
                            ? i18nT('Alert_resolved', 'Alert Resolved')
                            : i18nT('Alert_acknowledged', 'Alert Acknowledged')
                        }
                      />
                    )
                  }
                  {
                    !this.props.alertRequestActive &&
                    this.props.alertRequestType !== '' &&
                    this.props.alertRequestStatus === false &&
                    (
                      <Alert
                        type={ Alert.TYPE.ERROR }
                        showCloseIcon={ false }
                        message={
                          this.props.alertRequestType === 'resolve'
                            ? i18nT('Alert_resolving_failed', 'Alert Resolving Failed')
                            : i18nT('Alert_acknowledging_failed', 'Alert Acknowledging Failed')
                        }
                      />
                    )
                  }
                  <HeaderFooterLayout
                    className="alert-modal-layout"
                    itemSpacing="0px"
                    header={
                      modalHeaderContent
                    }
                    bodyContent={
                      modalBodyContent
                    }
                  />
                </ContainerLayout>
              </StackingLayout>
            </FlexLayout>
          </FlexLayout>
        </FullPageModal>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown, { passive: true });
  }

  componentDidUpdate(prevProps) {
    if (this.props.alertRequestActive !== prevProps.alertRequestActive) {
      if (this.props.alertRequestActive === false) {
        setTimeout(() => {
          this.props.setAlertRequestType('');
          this.props.setAlertRequestStatus(true);
        }, 3000);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

}


const mapStateToProps = state => {
  return {
    alertModalLoading: state.groupsapi.alertModalLoading,
    alertRequestActive: state.groupsapi.alertRequestActive,
    alertRequestStatus: state.groupsapi.alertRequestStatus,
    alertRequestType: state.groupsapi.alertRequestType,
    alertInfo: state.groupsapi.alertInfo,
    alertList: state.groupsapi.alertList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAlertModalInfo: (entityId) => dispatch(fetchAlertModalInfo(entityId)),
    setAlertRequestStatus: (value) => dispatch(setAlertRequestStatus(value)),
    setAlertRequestType: (value) => dispatch(setAlertRequestType(value)),
    resolveAlert: (entityId) => dispatch(resolveAlert([entityId])),
    acknowledgeAlert: (entityId) => dispatch(acknowledgeAlert([entityId]))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertInfoModal);

