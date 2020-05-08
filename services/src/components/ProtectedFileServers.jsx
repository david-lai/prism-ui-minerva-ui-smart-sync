//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Protected file servers main view
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
//   'ProtectedFileServers', key, defaultValue, replacedValue);

class ProtectedFileServers extends React.Component {

  // Set the correspoding componets for each files route
  render() {
    return (
      <StackingLayout
        padding="0px"
        itemSpacing="0px"
      >
        <TextLabel>
          Protected file servers
        </TextLabel>
      </StackingLayout>
    );
  }

}

export default ProtectedFileServers;
