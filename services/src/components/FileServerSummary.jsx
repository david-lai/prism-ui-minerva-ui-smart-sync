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
  FlexItem,
  FlexLayout,
  Link,
  Table,
  Title
} from 'prism-reactjs';
import i18n from '../utils/i18n';

import {
  fetchFsData,
  setTab
} from '../actions';


// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServerSummary', key, defaultValue, replacedValue);

class FileServerSummary extends React.Component {

  static propTypes = {
  };

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
          title: i18nT('critical', 'Critical'),
          key: 'critical',
          render: this.renderAlertCell.bind(this, 'critical')
        },
        {
          title: i18nT('warning', 'Warning'),
          key: 'warning',
          render: this.renderAlertCell.bind(this, 'warning')
        },
        {
          title: i18nT('info', 'Info'),
          key: 'info',
          render: this.renderAlertCell.bind(this, 'info')
        }
      ]
    };
  }

  renderAlertCell(alertSeverity, cellData) {
    let color = Badge.BADGE_COLOR_TYPES.GRAY;
    if (alertSeverity === 'warning') {
      color = Badge.BADGE_COLOR_TYPES.YELLOW;
    } else if (alertSeverity === 'critical') {
      color = Badge.BADGE_COLOR_TYPES.RED;
    }
    return (
      <Badge color={ color } text={ cellData } />
    );
  }

  prepareSummaryFSData() {
    if (!this.props.fsData) {
      return false;
    }

    const summaryData = {
      total: 0,
      items: []
    };

    if (this.props.fsData && this.props.fsData.filtered_entity_count) {
      summaryData.total = this.props.fsData.filtered_entity_count;
      summaryData.items = this.props.fsData.group_results.flatMap((gr) => {
        return gr.entity_results.map((er) => {
          const fsResult = {
            entity_id: er.entity_id,
            title: ((er.data.find(ed => ed.name === 'name')).values[0].values[0] || ''),
            info: 0,
            warning: 0,
            critical: 0
          };
          if (er.alerts) {
            fsResult.info = er.alerts.filter(alert => alert.severity === 'info').length;
            fsResult.warning = er.alerts.filter(alert => alert.severity === 'warning').length;
            fsResult.critical = er.alerts.filter(alert => alert.severity === 'critical').length;
          }
          return fsResult;
        });
      });
    }
    return summaryData;
  }

  showAllServers = (e) => {
    e.preventDefault();
    this.props.setTab(1);
  }

  render() {
    const summaryData = this.prepareSummaryFSData();
    let tableTitle = i18nT('highlightedFileServers', 'Highlighted file servers');
    if (summaryData && summaryData.total) {
      tableTitle += ` (${summaryData.total})`;
    }
    tableTitle = (
      <Title size="h3">
        { tableTitle }
      </Title>
    );

    const dataSource = summaryData && summaryData.items ? summaryData.items : [];

    return (

      <FlexLayout
        flexDirection="column"
        padding="15px"
        flexGrow="1"
        flexShrink="0"
      >
        <FlexItem>
          <Table
            border={ false }
            loading={ !summaryData }
            structure={ this.state.tableStructure }
            topSection={
              {
                leftContent: tableTitle
              }
            }
            oldTable={ false }
            rowKey="entity_id"
            columns={ this.state.tableColumns }
            dataSource={ dataSource }
          />
        </FlexItem>

        { summaryData &&
          (
            <FlexItem
              flexShrink="1"
              flexGrow="0"
              alignSelf="center"
              style={
                {
                  marginTop: 'auto',
                  marginBottom: 0
                }
              }
            >
              <Link onClick={ this.showAllServers } >
                { i18nT('viewAllFileServers', 'View all File Servers') }
              </Link>
            </FlexItem>
          )
        }
      </FlexLayout>

    );
  }

  componentWillMount() {
    this.props.fetchFsData();
  }

}

const mapStateToProps = state => {
  return {
    fsData: state.groupsapi.fsData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchFsData: () => dispatch(fetchFsData(true)),
    setTab: (tabIndex) => dispatch(setTab(tabIndex))
  };
};

FileServerSummary.propTypes = {
  fsData: PropTypes.object,
  fetchFsData: PropTypes.func,
  setTab: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileServerSummary);
