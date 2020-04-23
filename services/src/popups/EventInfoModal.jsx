//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers alert popup
//
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
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
import AppConstants from '../utils/AppConstants';
import i18n from '../utils/i18n';

// Actions
import {
  fetchEventModalInfo
} from '../actions';


// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'EventInfoModal', key, defaultValue, replacedValue);


class EventInfoModal extends React.Component {

  static propTypes = {
    visible: PropTypes.bool,
    closeModalAction: PropTypes.func,
    modalLoading: PropTypes.bool,
    itemInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    itemList: PropTypes.array,
    // eslint-disable-next-line react/no-unused-prop-types
    fetchEventModalInfo: PropTypes.func
  };


  static getDerivedStateFromProps(props, state) {
    // let changed = false;
    const stateChanges = {};
    const { inputProps } = state;

    if (!props.visible) {
      // modal is benng closed, reset data
      // changed = true;
      inputProps.value = '';
      stateChanges.modalSearch = '';
      stateChanges.inputProps = inputProps;
      stateChanges.itemId = 0;
      stateChanges.item = null;
      stateChanges.itemInfo = null;
      stateChanges.selectedRow = null;
      return stateChanges;
    } else if (!state.itemId) {
      let item = null;
      if (props.itemList && props.itemList.length) {
        item = props.itemList.find(il => il.id === props.options.entity.entityId);
      }
      return {
        itemId: props.options.entity.entityId,
        item,
        itemInfo: null
      };
    } else if (state.item && state.itemId && state.item.entityId !== state.itemId) {
      let item = null;
      if (props.itemList && props.itemList.length) {
        item = props.itemList.find(il => il.id === state.itemId);
      }
      if (item) {
        return {
          item
        };
      }
    // } else if (!state.itemInfo) {
    //   if (!props.itemInfo || (props.itemInfo && props.itemInfo.entityId !== state.itemId)) {
    //     if (!props.modalLoading) {
    //       props.fetchEventModalInfo(state.itemId);
    //     }
    //     return null;
    //   } else {
    //     return {
    //       itemInfo: props.itemInfo
    //     };
    //   }
    } else if (!props.itemInfo) {
      if (!props.modalLoading) {
        props.fetchEventModalInfo(state.itemId);
      }
      return null;
    }

    return null;
  }

  state = {
    itemId: 0,
    item: null,
    itemInfo: null,
    loading: false,
    selectRowsData: [],
    selectedRow: null,
    modalSearch: '',
    inputProps: {
      value: '',
      onChange: null,
      onFocus: null
    }
  }

  frame = null

  constructor(props, context) {
    super(props, context);

    this.state.inputProps.onChange = this.handleSelectSearchChange;
    this.state.inputProps.onFocus = this.handleSelectSearchFocus;

    window.em = this;
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
    this.props.resolveAlert(this.state.itemId);
  }

  handleAcknowledgeClick = (e) => {
    this.props.acknowledgeAlert(this.state.itemId);
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
      modalSearch: value,
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
      itemId: row.key,
      inputProps,
      modalSearch: ''
    });
  }

  closeModal(e) {
    if (this.props.closeModalAction && typeof this.props.closeModalAction === 'function') {
      this.props.closeModalAction(e);
    }
  }


  fetchItemInfo() {
    let url = `${AppConstants.APIS.PRISM_GATEWAY}/events`;
    url += `?event_ids=${this.state.itemId}&detailed_info=true&__=${new Date().getTime()}`;
    this.setState({
      loading: true
    });
    axios.get(url)
      .then((resp) => {
        if (resp && resp.status && resp.status === 200 && resp.data) {
          let entity;
          if (resp.data && resp.data.entities && Array.isArray(resp.data.entities)) {
            entity = resp.data.entities.find(re => re.id === this.state.itemId);
          }
          if (entity) {
            this.setState({
              itemInfo: entity,
              loading: false
            });
          }
        }
      })
      .catch((ex) => {
        console.error(ex);
      });
  }

  prepareAlertData() {
    let defaultValue = i18nT('N/A', 'N/A');
    if (this.props.modalLoading) {
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

    if (!this.props.modalLoading && this.state.itemInfo) {
      const itemData = this.state.itemInfo;

      if (itemData) {
        alertData.description = this.populateDefaultMessage(
          itemData.default_message,
          itemData.parameters
        );
        if (itemData.impact_type_list && itemData.impact_type_list.length) {
          alertData.impactType = FormatterUtil.separatePascalCase(
            itemData.impact_type_list.join(' ')
          );
        }
        if (itemData.title) {
          alertData.title = itemData.title;
        }
        if (
          itemData.source_entity &&
          itemData.source_entity.entity &&
          itemData.source_entity.entity.name
        ) {
          alertData.sourceEntity = itemData.source_entity.entity.name;
        }

        if (itemData.severity === 'info') {
          alertData.severity.color = Badge.BADGE_COLOR_TYPES.GRAY;
          alertData.severity.label = i18nT('alertSeverityInfo', 'Info');
        } else if (itemData.severity === 'warning') {
          alertData.severity.color = Badge.BADGE_COLOR_TYPES.YELLOW;
          alertData.severity.label = i18nT('alertSeverityWarning', 'Warning');
        } else if (itemData.severity === 'critical') {
          alertData.severity.color = Badge.BADGE_COLOR_TYPES.RED;
          alertData.severity.label = i18nT('alertSeverityCritical', 'Critical');
        }
      }

      const createdMoment = moment(itemData.creation_time);
      const loMoment = moment(itemData.latest_occurrence_time);
      alertData.createdLabel = createdMoment.format('MM/DD/YY h:m:s A');
      alertData.lastOccuredLabel = loMoment.format('MM/DD/YY h:m:s A');


      alertData.possibleCauses = this.getPossibleCauses();
      alertData.resolutions = this.getResolutionList();

      const resolvedStatus = itemData.resolution_status;
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

      const acknowledgedStatus = itemData.acknowledged_status;
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
    if (this.state.itemInfo) {
      if (
        this.state.itemInfo.possible_cause_list &&
        this.state.itemInfo.possible_cause_list.length
      ) {
        const lists = this.state.itemInfo.possible_cause_list;
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
    } else if (this.props.modalLoading) {
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
    if (this.state.itemInfo) {
      if (
        this.state.itemInfo.possible_cause_list &&
        this.state.itemInfo.possible_cause_list.length
      ) {
        const lists = this.state.itemInfo.possible_cause_list;
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
    } else if (this.props.modalLoading) {
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

  getDescriptionText(entity) {
    let { default_message: defaultMessage } = entity;
    const {
      param_value_list,
      param_name_list
    } = entity;
    let start, end;
    const numberOfReplacement = defaultMessage.split('{').length;
    for (let i = 0; i < numberOfReplacement && numberOfReplacement > 1; i++) {
      start = defaultMessage.indexOf('{');
      end = defaultMessage.indexOf('}');
      defaultMessage = `${defaultMessage.slice(0, start)}
        ${param_value_list[param_name_list.indexOf(defaultMessage.slice(start + 1, end))]}
        ${defaultMessage.slice(end + 1)}`;
    }
    return defaultMessage;
  }

  getSelectRows() {
    let data = [];
    if (this.state.selectedRow) {
      data.push(this.state.selectedRow);
    }

    if (this.props.itemList && this.props.itemList.length) {
      data = this.props.itemList.map((al, index) => {
        return {
          key: al.entity_id,
          id: al.entity_id,
          label: al.default_message
        };
      });
    }
    if (this.state.modalSearch) {
      const re = new RegExp(this.state.modalSearch.replace(/\//g, '\\/'), 'ig');
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
    if (this.props.modalLoading || this.props.alertRequestActive) {
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
                this.props.modalLoading ||
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
                this.props.modalLoading ||
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
            { this.state.item.default_message }
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
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

}


const mapStateToProps = state => {
  return {
    modalLoading: state.groupsapi.eventModalLoading,
    itemInfo: state.groupsapi.eventModalInfo,
    itemList: state.groupsapi.eventList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchEventModalInfo: (entityId) => dispatch(fetchEventModalInfo(entityId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventInfoModal);

