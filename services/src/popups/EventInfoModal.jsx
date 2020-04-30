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
  Button,
  CloseIcon,
  ContainerLayout,
  FlexItem,
  FlexLayout,
  FullPageModal,
  HeaderFooterLayout,
  Loader,
  Select,
  StackingLayout,
  TextLabel,
  Title
} from '@nutanix-ui/prism-reactjs';

// Local includes
import FakeProgress from '../components/ui/FakeProgress.jsx';

// import AppConstants from '../utils/AppConstants';
import i18n from '../utils/i18n';


// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'EventInfoModal', key, defaultValue, replacedValue);


class EventInfoModal extends React.Component {

  static propTypes = {
    visible: PropTypes.bool,
    closeModalAction: PropTypes.func,
    // prop IS being used in getDerivedStateFromProps
    // eslint-disable-next-line react/no-unused-prop-types
    options: PropTypes.object,
    itemList: PropTypes.array,
    listLoading: PropTypes.bool
  };


  static getDerivedStateFromProps(props, state) {
    let itemId = 0;
    if (!props.visible) {
      const stateChanges = {};
      const { inputProps } = state;
      inputProps.value = '';
      stateChanges.modalSearch = '';
      stateChanges.inputProps = inputProps;
      stateChanges.itemId = 0;
      stateChanges.ready = false;
      stateChanges.selectedRow = null;
      return stateChanges;
    } else if (!state.itemId) {
      if (props.options.entity.entityId) {
        itemId = props.options.entity.entityId;
      }
      return {
        itemId
      };
    } else if (props.listLoading) {
      return {
        ready: false
      };
    }
    return null;
  }

  state = {
    itemId: 0,
    ready: false,
    selectRowsData: [],
    selectedRow: null,
    modalSearch: '',
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
      ready: false,
      selectedRow: row,
      itemId: row.key,
      inputProps,
      modalSearch: ''
    }, () => {
      setTimeout(() => {
        this.setState({
          ready: true
        });
      }, 1000);
    });
  }

  closeModal(e) {
    if (this.props.closeModalAction && typeof this.props.closeModalAction === 'function') {
      this.props.closeModalAction(e);
    }
  }


  updateModalData() {
    if (!this.props.listLoading && this.state.itemId) {
      const selectRowsData = this.getSelectRows();
      let selectedRow = selectRowsData.find(srd => srd.id === this.state.itemId);
      if (!selectedRow) {
        selectedRow = null;
      }
      this.setState({
        selectedRow,
        selectRowsData
      }, () => {
        setTimeout(() => {
          this.setState({
            ready: true
          });
        }, 1000);
      });
    }
  }


  prepareModalData() {
    let defaultValue = i18nT('N/A', 'N/A');
    if (this.props.listLoading) {
      defaultValue = (<Loader key="defaultValue" />);
    }
    const modalData = {
      title: defaultValue,
      eventType: defaultValue,
      createdLabel: defaultValue,
      sourceEntity: defaultValue,
      clusterVersion: defaultValue
    };
    if (!this.props.listLoading && this.state.ready) {
      const listItem = this.props.itemList.find(il => il.entity_id === this.state.itemId);
      let itemData;
      if (listItem && listItem.details) {
        itemData = listItem.details;
        if (listItem.default_message) {
          modalData.title = listItem.default_message;
        }

        if (itemData) {
          if (
            itemData.source_entity &&
            itemData.source_entity.entity &&
            itemData.source_entity.entity.name
          ) {
            modalData.sourceEntity = itemData.source_entity.entity.name;
          }

          const createdMoment = moment(itemData.creation_time);
          modalData.createdLabel = createdMoment.format('MM/DD/YY h:m:s A');

          const loMoment = moment(itemData.latest_occurrence_time);
          modalData.lastOccuredLabel = loMoment.format('MM/DD/YY h:m:s A');
        }
      }
    }
    return modalData;
  }

  getSelectRows() {
    let data = [];
    if (this.props.itemList && this.props.itemList.length) {
      data = this.props.itemList.map((listItem, index) => {
        return {
          key: listItem.entity_id,
          id: listItem.entity_id,
          label: listItem.default_message
        };
      });
    }

    if (this.state.modalSearch) {
      const re = new RegExp(this.state.modalSearch.replace(/\//g, '\\/'), 'ig');
      data = data.filter(row => {
        return re.test(row.label);
      });
    }
    return data;
  }

  renderHeaderActions() {
    return (
      <FlexLayout
        itemSpacing="0px"
        alignItems="center"
        justifyContent="space-between"
      >
        <FlexItem>
          { this.renderHeaderSelector() }
        </FlexItem>
        <FlexItem
          className="alert-modal-actions"
        >
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

  renderHeaderSelector() {
    const inputProps = {
      ...{},
      ...this.state.inputProps
    };
    let selectedRow = this.state.selectedRow;
    if (this.props.listLoading || !this.state.ready) {
      inputProps.disabled = true;
      selectedRow = {
        ...{},
        ...this.state.selectedRow,
        label: i18nT('Loading', 'Loading')
      };
    }
    return (
      <div className="entity-selector-wrapper">
        <Select
          className="entity-selector-field"
          dropdownMatchSelectWidth={ false }
          searchable={ true }
          label={ i18nT('events', 'Events') }
          rowsData={ this.getSelectRows() }
          inputProps={ inputProps }
          onSelectedChange={ this.handleOnSelectedChange }
          selectedRow={ selectedRow }
          getPopupContainer={ () => document.querySelector('.entity-selector-list-wrapper') }
        />
        <div className="entity-selector-list-wrapper" />
      </div>
    );
  }

  render() {
    const modalData = this.prepareModalData();
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
          <span />
        </Title>
      </StackingLayout>
    );

    let modalBodyContent = (
      <StackingLayout className="loader-center-wrapper">
        <Loader overlay={ true } tip={ i18nT('Loading', 'Loading') } />
      </StackingLayout>
    );


    if (!this.props.listLoading && this.state.ready) {
      leftPanel = (
        <StackingLayout itemSpacing="20px">
          <StackingLayout itemSpacing="5px">
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
                  { modalData.createdLabel }
                </TextLabel>
              </FlexItem>
            </FlexLayout>


            <FlexLayout padding="5px" itemSpacing="10px">
              <FlexItem flexGrow="1">
                <TextLabel>
                  { i18nT('EventType', 'Event Type') }
                </TextLabel>
              </FlexItem>
              <FlexItem>
                <TextLabel type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }>
                  { modalData.eventType }
                </TextLabel>
              </FlexItem>
            </FlexLayout>

          </StackingLayout>
        </StackingLayout>
      );

      modalHeaderContent = (
        <StackingLayout padding="10px">
          <Title size="h2">
            { i18nT('EventDetails', 'Event Details') }
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
              { modalData.title }
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
              percent={ 40 }
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
    this.updateModalData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.visible &&
      this.state.itemId &&
      (
        (
          prevProps.listLoading &&
          this.props.listLoading
        ) ||
        prevState.itemId !== this.state.itemId
      )
    ) {
      this.updateModalData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

}


const mapStateToProps = state => {
  return {
    itemList: state.groupsapi.eventList,
    listLoading: state.groupsapi.eventListLoading
  };
};

export default connect(
  mapStateToProps,
  null
)(EventInfoModal);

