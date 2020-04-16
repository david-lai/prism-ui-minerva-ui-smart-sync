//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers summary view
//

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Badge,
  ContainerLayout,
  FlexLayout,
  FlexItem,
  Loader,
  Table,
  TextLabel
} from '@nutanix-ui/prism-reactjs';

import i18n from '../utils/i18n';

import noServersIcon from '../assets/images/no-servers.svg';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServerSummary', key, defaultValue, replacedValue);

class FileServerSummary extends React.Component {

  /**
   * Constructor method
   *
   * @param  {Object} props   Component props
   * @param  {Object} context Component conntext
   *
   * @return {undefined}
   */
  constructor(props, context) {
    super(props, context);

    this.state = {
      tableStructure: {
        hideHeader: true,
        columnWidths: {
          title: '60%'
        }
      },
      tableColumns: [
        {
          title: i18nT('fileServers', 'File servers'),
          key: 'title'
        },
        {
          title: i18nT('fileServerAlertCritical', 'Critical'),
          key: 'critical',
          render: this.renderAlertCell.bind(this, 'critical')
        },
        {
          title: i18nT('fileServerAlertWarning', 'Warning'),
          key: 'warning',
          render: this.renderAlertCell.bind(this, 'warning')
        },
        {
          title: i18nT('fileServerAlertInfo', 'Info'),
          key: 'info',
          render: this.renderAlertCell.bind(this, 'info')
        }
      ]
    };
  }

  /**
   * Renders single table cell for file server alerts
   *
   * @param  {String}       alertSeverity   Severity (info, warning, critical)
   * @param  {String|node}  cellData        Text to display next to the badge
   *
   * @return {node}                         Node for table cell contents
   */
  renderAlertCell(alertSeverity, cellData) {
    let value = cellData;
    if (value === null) {
      value = (
        <Loader />
      );
    }
    let color = Badge.BADGE_COLOR_TYPES.GRAY;
    if (alertSeverity === 'warning') {
      color = Badge.BADGE_COLOR_TYPES.YELLOW;
    } else if (alertSeverity === 'critical') {
      color = Badge.BADGE_COLOR_TYPES.RED;
    }
    return (
      <Badge color={ color } text={ value } />
    );
  }

  /**
   * Renders the component
   *
   * @return {node} Component contents
   */
  render() {
    const summaryData = this.props.serverSummary;
    const dataSource = summaryData && summaryData.items ? summaryData.items : [];
    return (
      <ContainerLayout padding="15px">
        { this.props.highlightedWidgetBusy !== true &&
          this.props.fsData === false &&
          (
            <FlexLayout
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <FlexItem>
                <TextLabel
                  type={ TextLabel.TEXT_LABEL_TYPE.ERROR }
                  size={ TextLabel.TEXT_LABEL_SIZE.MEDIUM }
                >
                  { i18nT('fetchingDataFailed', 'Fetching data failed') }
                </TextLabel>
              </FlexItem>
            </FlexLayout>
          )
        }
        { this.props.highlightedWidgetBusy !== true &&
          typeof this.props.fsData === 'object' &&
          // this.props.fsData !== false &&
          dataSource.length === 0 &&
          (
            <FlexLayout
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              itemSpacing="0px"
            >
              <FlexItem>
                <img
                  src={ noServersIcon }
                  alt={ i18nT('NoHighligtedFileServers', 'No Highlighted File Servers') }
                  height="150"
                />
              </FlexItem>
              <FlexItem>
                <TextLabel>
                  { i18nT('NoHighligtedFileServers', 'No Highlighted File Servers') }
                </TextLabel>
              </FlexItem>
            </FlexLayout>
          )
        }

        { this.props.fsData !== false &&
          // dataSource.length > 0 &&
          (
            <Table
              border={ false }
              loading={ !summaryData || !this.props.fsData || this.props.highlightedWidgetBusy }
              structure={ this.state.tableStructure }
              oldTable={ false }
              rowKey="entity_id"
              columns={ this.state.tableColumns }
              dataSource={ dataSource }
            />
          )
        }
      </ContainerLayout>
    );
  }

}

/**
 * Maps store state to props
 * @param  {Object} state Store state
 *
 * @return {Object}       Props map
 */
const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData,
    serverAlerts: state.groupsapi.serverAlerts,
    highlightedWidgetBusy: state.groupsapi.highlightedWidgetBusy
  };
};

FileServerSummary.propTypes = {
  serverSummary: PropTypes.object,
  fsData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  highlightedWidgetBusy: PropTypes.bool
};

export default connect(
  mapStateToProps,
  null
)(FileServerSummary);
