//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Replication jobs main view
//
import React from 'react';
// import PropTypes from 'prop-types';
import {
  StackingLayout,
  TextLabel
} from '@nutanix-ui/prism-reactjs';

// import i18n from '../utils/i18n';

// Helper to translate strings from this module
// const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
//   'ReplicationJobs', key, defaultValue, replacedValue);

class ReplicationJobs extends React.Component {

  // Set the correspoding componets for each files route
  render() {
    return (
      <StackingLayout
        padding="0px"
        itemSpacing="0px"
      >
        <TextLabel>
          Replication jobs
        </TextLabel>
      </StackingLayout>
    );
  }

}

export default ReplicationJobs;
