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
  Paragraph,
  Select,
  StackingLayout,
  TextLabel,
  Title
} from '@nutanix-ui/prism-reactjs';

// Local includes
import FormatterUtil from '../utils/FormatterUtil';
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
    alert: PropTypes.object,
    visible: PropTypes.bool,
    closeModalAction: PropTypes.func,
    alertModalLoading: PropTypes.bool,
    alertRequestActive: PropTypes.bool,
    alertRequestStatus: PropTypes.bool,
    alertRequestType: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    alertInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    alertList: PropTypes.array,
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
      changed = true;
      inputProps.value = '';
      stateChanges.inputProps = inputProps;
      stateChanges.alertId = 0;
      stateChanges.alertObject = null;
      stateChanges.alertInfo = null;
      stateChanges.selectedRow = null;
      stateChanges.alertSearch = '';
    } else {
      if (!state.alertObject) {
        if (props.alert && props.alert.entityId) {
          changed = true;
          inputProps.value = props.alert.title;
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
        changed = true;
        inputProps.value = '';
        stateChanges.inputProps = inputProps;
        stateChanges.alertObject = null;
        stateChanges.alertSearch = '';
        stateChanges.alertInfo = null;
        stateChanges.selectedRow = null;
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
        changed = true;
        stateChanges.alertInfo = props.alertInfo.entity;
        stateChanges.selectedRow = {
          id: props.alertInfo.entity.entityId,
          key: props.alertInfo.entity.entityId,
          label: props.alertInfo.entity.title
        };
        stateChanges.alertSearch = '';
      }

      if (state.alertSearch && state.inputProps.value !== state.alertSearch) {
        changed = true;
        inputProps.value = state.alertSearch;
        stateChanges.inputProps = inputProps;
      } else if (
        state.alertInfo &&
        state.alertInfo.title &&
        state.inputProps.value !== state.alertInfo.title
      ) {
        changed = true;
        inputProps.value = state.alertInfo.title;
        stateChanges.inputProps = inputProps;
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
    }
  }

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
    }
  }

  handleSelectSearchChange = (e) => {
    const { value } = e.currentTarget;
    this.setState({
      alertSearch: value
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
      const alert = this.state.alertObject;
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
      }

      const createdMoment = moment(parseInt((alert._created_timestamp_usecs_ / 1000), 10));
      const loMoment = moment(alertInfo.latest_occurrence_time);
      alertData.createdLabel = createdMoment.format('MM/DD/YY h:m:s A');
      alertData.lastOccuredLabel = loMoment.format('MM/DD/YY h:m:s A');

      if (alert.severity === 'info') {
        alertData.severity.color = Badge.BADGE_COLOR_TYPES.GRAY;
        alertData.severity.label = i18nT('alertSeverityInfo', 'Info');
      } else if (alert.severity === 'warning') {
        alertData.severity.color = Badge.BADGE_COLOR_TYPES.YELLOW;
        alertData.severity.label = i18nT('alertSeverityWarning', 'Warning');
      } else if (alert.severity === 'critical') {
        alertData.severity.color = Badge.BADGE_COLOR_TYPES.RED;
        alertData.severity.label = i18nT('alertSeverityCritical', 'Critical');
      }

      alertData.possibleCauses = this.getPossibleCauses();
      alertData.resolutions = this.getResolutionList();

      const resolvedStatus = alertInfo.resolution_status;
      if (resolvedStatus) {
        if (resolvedStatus.is_true) {
          alertData.status.resolved = true;
          if (resolvedStatus.is_auto_resolved) {
            alertData.status.statusLabel = i18nT('AutoResolved', 'Auto Resolved');
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
        <Paragraph>
          {
            possibleCauseList.map((p, i) => {
              return (
                <TextLabel key={ `cause_${i}` } type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { p }
                </TextLabel>
              );
            })
          }
        </Paragraph>
      );
    } else if (this.props.alertModalLoading) {
      possibleCauses = (
        <Loader />
      );
    } else {
      possibleCauses = (
        <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
          { i18nT('N/A', 'N/A') }
        </TextLabel>
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
        <Paragraph>
          {
            resolutionList.map((p, i) => {
              return (
                <TextLabel key={ `cause_${i}` } type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { p }
                </TextLabel>
              );
            })
          }
        </Paragraph>
      );
    } else if (this.props.alertModalLoading) {
      resolutions = (
        <Loader />
      );
    } else {
      resolutions = (
        <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
          { i18nT('ContactNutanixSupport', 'Contact Nutanix Support') }
        </TextLabel>
      );
    }
    return resolutions;
  }

  getSelectRows() {
    let data = [];
    if (this.state.selectedRow) {
      data.push(this.state.selectedRow);
    }

    if (this.props.alertList.length) {
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
    const data = this.getSelectRows();

    return (
      <div className="entity-selector-wrapper">
        <Select
          className="entity-selector-field"
          dropdownMatchSelectWidth={ false }
          searchable={ true }
          label={ i18nT('alerts', 'Alerts') }
          rowsData={ data }
          inputProps={ this.state.inputProps }
          onSelectedChange={ this.handleOnSelectedChange }
          selectedRow={ this.state.selectedRow }
          loading={ this.props.alertModalLoading }
        />
      </div>
    );
  }

  renderHeaderActions() {
    return (
      <FlexLayout
        itemFlexBasis="100pc"
        itemSpacing="0px"
        alignItems="center"
      >
        <FlexItem>
          { this.renderAlertSelector() }
        </FlexItem>
        <FlexItem alignSelf="flex-end">
          <ButtonGroup>
            <Button
              type="secondary"
              style={
                {
                  width: '150px'
                }
              }
              onClick={ this.handleResolveClick }
              disabled={
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
                  width: '150px'
                }
              }
              onClick={ this.handleAcknowledgeClick }
              disabled={
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
    const leftPanel = (
      <StackingLayout itemSpacing="20px">
        <StackingLayout itemSpacing="10px">
          <Title size="h2">
            { alertData.title }
          </Title>
          <TextLabel>
            { i18nT('AlertTitle', 'Alert Title') }
          </TextLabel>
        </StackingLayout>
        <Divider type="short" />
        <StackingLayout itemSpacing="5px">
          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('SourceEntity', 'Source Entity') }
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
                { i18nT('CreatedTime', 'Created Time') }
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
                { i18nT('LastOccurred', 'Last Occured') }
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
                { i18nT('ImpactType', 'Impact Type') }
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
                { i18nT('AcknowledgedBy', 'Acknowledged By') }
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
                { i18nT('ResolvedBy', 'Resolved By') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                { alertData.status.resolvedBy }
              </TextLabel>
            </FlexItem>
          </FlexLayout>

          <FlexLayout padding="5px" itemSpacing="10px">
            <FlexItem flexGrow="1">
              <TextLabel>
                { i18nT('Description', 'Description') }
              </TextLabel>
            </FlexItem>
            <FlexItem>
              <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                { alertData.description }
              </TextLabel>
            </FlexItem>
          </FlexLayout>
        </StackingLayout>
      </StackingLayout>
    );


    const footer = (
      <div />
    );

    return (
      <div>

        <FullPageModal
          visible={ this.props.visible }
          _title={ alertData.title }
          className="alert-info-modal"
          footer={ footer }
          headerActions={
            this.renderHeaderActions()
          }
        >
          <FlexLayout itemSpacing="0px">
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
                            ? i18nT('AlertResolved', 'Alert Resolved')
                            : i18nT('AlertAcknowledged', 'Alert Acknowledged')
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
                            ? i18nT('AlertResolvingFailed', 'Alert Resolving Failed')
                            : i18nT('AlertAcknowledgingFailed', 'Alert Acknowledging Failed')
                        }
                      />
                    )
                  }
                  <HeaderFooterLayout
                    itemSpacing="0px"
                    header={
                      <StackingLayout padding="10px">
                        <Title size="h3">
                          { i18nT('PossibleCause', 'Possible Cause') }
                        </Title>
                      </StackingLayout>
                    }
                    bodyContent={
                      <StackingLayout
                        itemSpacing="10px"
                        style={
                          {
                            width: '100%'
                          }
                        }>
                        <StackingLayout padding="10px">
                          { alertData.possibleCauses }
                        </StackingLayout>
                        <Divider />
                        <StackingLayout padding="10px" itemSpacing="0px">
                          <Title size="h4">
                            { i18nT('Recommendations', 'Recommendations') }
                          </Title>
                          <StackingLayout padding="10px">
                            <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                              { alertData.resolutions }
                            </TextLabel>
                          </StackingLayout>
                        </StackingLayout>
                      </StackingLayout>
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
    if (!this.state.alertInfo) {
      this.props.fetchAlertModalInfo(this.props.alert.entityId);
    }
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

