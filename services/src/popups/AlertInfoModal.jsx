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
  ContainerLayout,
  Divider,
  FlexItem,
  FlexLayout,
  FullPageModal,
  HeaderFooterLayout,
  CloseIcon,
  Loader,
  Paragraph,
  TextLabel,
  Title,
  StackingLayout
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
    alertInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    fetchAlertModalInfo: PropTypes.func,
    setAlertRequestStatus: PropTypes.func,
    setAlertRequestType: PropTypes.func,
    resolveAlert: PropTypes.func,
    acknowledgeAlert: PropTypes.func
  };

  static getDerivedStateFromProps(props, state) {
    let changed = false;
    const stateChanges = {};

    if (
      props.alert &&
      props.alert.entityId &&
      (
        props.alert.entityId !== state.alertId ||
        !state.alertId
      )
    ) {
      changed = true;
      stateChanges.alertId = props.alert.entityId;
      stateChanges.alertObject = props.alert;
      stateChanges.alertInfo = null;
      props.fetchAlertModalInfo(props.alert.entityId);
    } else if (state.alertId && props.alert.entityId !== state.alertId) {
      props.fetchAlertModalInfo(props.alert.entityId);
      changed = true;
      stateChanges.alertId = props.alert.entityId;
      stateChanges.alertObject = null;
      stateChanges.alertInfo = null;
    }
    if (props.alertInfo !== state.alertInfo) {
      changed = true;
      stateChanges.alertInfo = props.alertInfo;
    }

    // if (!state.alertObject && props.alert) {
    //   changed = true;
    //   stateChanges.alertObject = props.alert;
    // }


    // if (!state.alertId && props.alert.entityId) {
    //   changed = true;
    //   stateChanges.alertId = props.alert.entityId;
    // }
    if (changed) {
      return stateChanges;
    }
    return null;
  }

  state = {
    alertId: 0,
    alertObject: {},
    alertInfo: null
  }

  constructor(props, context) {
    super(props, context);
    window.am = this;
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
      description: defaultValue,
      createdLabel: defaultValue,
      lastOccuredLabel: defaultValue,
      severity: {
        color: Badge.BADGE_COLOR_TYPES.GRAY,
        label: defaultValue
      },
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

    if (!this.props.alertModalLoading && this.state.alertInfo && this.state.alertInfo.entity) {
      const alert = this.state.alertObject;
      const alertInfo = this.state.alertInfo.entity;

      alertData.description = this.populateDefaultMessage(
        alertInfo.default_message,
        alertInfo.parameters
      );

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
        this.state.alertInfo.entity.possible_cause_list &&
        this.state.alertInfo.entity.possible_cause_list.length
      ) {
        const lists = this.state.alertInfo.entity.possible_cause_list;
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
        this.state.alertInfo.entity.possible_cause_list &&
        this.state.alertInfo.entity.possible_cause_list.length
      ) {
        const lists = this.state.alertInfo.entity.possible_cause_list;
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

  renderHeaderActions() {
    return (
      <FlexLayout
        itemFlexBasis="100pc"
        itemSpacing="0px"
        alignItems="center"
      >
        <FlexItem>
          <div>
            asd
          </div>
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
            { this.state.alertObject.title }
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
                {
                  FormatterUtil.pickListItem(
                    this.state.alertObject.param_value_list, { index: 1 }
                  )
                }
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
                { FormatterUtil.separatePascalCase(this.props.alert.impact_type) }
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
          _title={ this.state.alertObject.title }
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
    // if (this.props.alert && prevProps.alert) {
    //   if (this.props.alert.entityId !== prevProps.alert.entityId) {
    //     this.props.fetchAlertModalInfo(this.props.alert.entityId);
    //   }
    // } else if (!prevProps.alert.entityId && this.props.alert.entityId) {
    //   this.props.fetchAlertModalInfo(this.props.alert.entityId);
    // }
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
    alertInfo: state.groupsapi.alertInfo
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

