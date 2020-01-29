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
  Loader,
  Table
} from 'prism-reactjs';
import i18n from '../utils/i18n';

import AppUtil from '../utils/AppUtil';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServerSummary', key, defaultValue, replacedValue);

class FileServerSummary extends React.Component {

  /**
   * Constructor method
   *
   * @param  {Object} props Component props
   *
   * @return {undefined}
   */
  constructor(props) {
    super(props);

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
   * Prepares summary FS data, calculating total and preparing table dataSource
   *
   * @return {Object}   Prepared FS data
   */
  prepareSummaryFSData() {
    if (!this.props.fsData) {
      return false;
    }

    const summaryData = {
      total: 0,
      items: []
    };

    if (this.props.fsData.filtered_entity_count) {
      summaryData.total = this.props.fsData.filtered_entity_count;
      summaryData.items = this.props.fsData.group_results.flatMap((gr) => {
        return gr.entity_results.map((er) => {
          const fsResult = {
            entity_id: er.entity_id,
            title: ((er.data.find(ed => ed.name === 'name')).values[0].values[0] || ''),
            info: null,
            warning: null,
            critical: null
          };
          if (this.props.serverAlerts && this.props.serverAlerts[er.entity_id]) {
            const fsAlerts = AppUtil.extractGroupResults(this.props.serverAlerts[er.entity_id]);
            fsResult.info = fsAlerts.filter(alert => alert.severity === 'info').length;
            fsResult.warning = fsAlerts.filter(alert => alert.severity === 'warning').length;
            fsResult.critical = fsAlerts.filter(alert => alert.severity === 'critical').length;
          }

          return fsResult;
        });
      });
    }
    return summaryData;
  }

  /**
   * Renders the component
   *
   * @return {node} Component contents
   */
  render() {
    const summaryData = this.prepareSummaryFSData();
    const dataSource = summaryData && summaryData.items ? summaryData.items : [];

    return (

      <ContainerLayout padding="15px">
        <Table
          border={ false }
          loading={ !summaryData }
          structure={ this.state.tableStructure }
          oldTable={ false }
          rowKey="entity_id"
          columns={ this.state.tableColumns }
          dataSource={ dataSource }
        />
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
    serverAlerts: state.groupsapi.serverAlerts
  };
};

FileServerSummary.propTypes = {
  serverAlerts: PropTypes.object,
  fsData: PropTypes.object
};

export default connect(
  mapStateToProps,
  null
)(FileServerSummary);
