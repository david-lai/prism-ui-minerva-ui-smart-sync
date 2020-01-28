//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file for summary tab view
//
import React from 'react';
import { connect } from 'react-redux';
import {
  Dashboard,
  DashboardWidgetLayout
} from 'prism-reactjs';

import FileServerSummary from './FileServerSummary.jsx';
import AlertSummary from './AlertSummary.jsx';


// import i18n from '../utils/i18n';

// Helper to translate strings from this module
// const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
//   'Summary', key, defaultValue, replacedValue);

class Summary extends React.Component {

  static propTypes = {
  };

  render() {
    const twoColumnLayout = [
      {
        i: 'fileServerSummary'
      },
      {
        i: 'alertSummary',
        x: 1
      }
    ];
    const oneColumnLayout = [
      {
        i: 'fileServerSummary'
      },
      {
        i: 'alertSummary',
        y: 1
      }
    ];

    return (
      <Dashboard
        breakpoints={
          {
            lg: 1200,
            md: 996,
            sm: 768,
            xs: 480,
            xxs: 0
          }
        }
        cols={
          {
            lg: 2,
            md: 2,
            sm: 2,
            xs: 1,
            xxs: 1
          }
        }
        layouts={
          {
            lg: twoColumnLayout,
            md: twoColumnLayout,
            sm: twoColumnLayout,
            xs: oneColumnLayout,
            xxs: oneColumnLayout
          }
        }
      >
        <div key="fileServerSummary">
          <DashboardWidgetLayout
            bodyContent={ (<FileServerSummary />) }
            bodyContentProps={
              {
                flexDirection: 'column',
                alignItems: 'stretch'
              }
            }
          />
        </div>
        <div key="alertSummary">
          <DashboardWidgetLayout
            bodyContent={ (<AlertSummary />) }
            bodyContentProps={
              {
                flexDirection: 'column',
                alignItems: 'stretch'
              }
            }
          />
        </div>
      </Dashboard>
    );
  }

}


Summary.propTypes = {};

export default connect(
  null,
)(Summary);
