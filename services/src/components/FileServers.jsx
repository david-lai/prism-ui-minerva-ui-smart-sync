//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers main view
//
import React from 'react';
import PropTypes from 'prop-types';
import { EntityBrowser } from '@nutanix-ui/ebr-ui';
import {
  StackingLayout,
  TextLabel,
  Tooltip
} from '@nutanix-ui/prism-reactjs';
import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'FileServers', key, defaultValue, replacedValue);

class FileServers extends React.Component {

  static propTypes = {
    ebConfig: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired
  };

  // Set the correspoding componets for each files route
  render() {
    return (
      <StackingLayout
        className="fs-list-root"
        padding="0px"
        itemSpacing="0px"
      >
        <div className="fs-tooltip-wrapper" >
          <Tooltip
            placement="rightTop"
            content={
              <div
                style={
                  {
                    maxWidth: '300px'
                  }
                }
              >
                { i18nT(
                  'Not_seeing_all_file_servers_tooltip',
                  'Not_seeing_all_file_servers_tooltip')
                }
              </div>
            }
          >
            <TextLabel
              className="fs-tooltip-label"
              type={ TextLabel.TEXT_LABEL_TYPE.PRIMARY }
            >
              { i18nT('Not_seeing_all_file_servers', 'Not seeing all File Servers?') }
            </TextLabel>
          </Tooltip>
        </div>
        <EntityBrowser { ...this.props.ebConfig } />
      </StackingLayout>
    );
  }

}

export default FileServers;
