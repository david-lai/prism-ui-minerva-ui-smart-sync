//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// ProtectedFileServers is Protected file servers main view
//
import React from 'react';
import PropTypes from 'prop-types';
import { EntityBrowser } from '@nutanix-ui/ebr-ui';
import {
  StackingLayout,
  FlexLayout,
  FlexItem,
  TextLabel,
  CheckMarkIcon,
  CloseIcon
} from '@nutanix-ui/prism-reactjs';

import activeIcon from '../assets/images/active-icon.svg';
import secondaryIcon from '../assets/images/secondary-icon.svg';
import replicationIcon from '../assets/images/replication-icon.svg';

import i18n from '../utils/i18n';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'ProtectedFileServers', key, defaultValue, replacedValue);

class ProtectedFileServers extends React.Component {

  static propTypes = {
    ebConfig: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired
  };

  renderTableFooter() {
    return (
      <FlexLayout
        className="table-custom-footer"
        padding="10px"
        justifyContent="center"
        alignItems="center"
      >
        <FlexItem className="custom-footer-cell">
          <img
            height="15px"
            src={ activeIcon }
            alt={ i18nT('active_file_server', 'Active File Server') }
          />
          <TextLabel className="legend-text">
            { i18nT('active_file_server', 'Active File Server') }
          </TextLabel>
        </FlexItem>
        <FlexItem className="custom-footer-cell">
          <img
            height="15px"
            src={ replicationIcon }
            alt={ i18nT('replication', 'Replication') }
          />
          <TextLabel className="legend-text">
            { i18nT('replication', 'Replication') }
          </TextLabel>
        </FlexItem>
        <FlexItem className="custom-footer-cell">
          <img
            height="15px"
            src={ secondaryIcon }
            alt={ i18nT('standby_file_server', 'Standby File Server') }
          />
          <TextLabel className="legend-text">
            { i18nT('standby_file_server', 'Standby File Server') }
          </TextLabel>
        </FlexItem>
        <FlexItem className="custom-footer-cell">
          <CheckMarkIcon color="#68DC8E" />
          <TextLabel className="legend-text">
            { i18nT('rpo_compliant', 'RPO Compliant') }
          </TextLabel>
        </FlexItem>
        <FlexItem className="custom-footer-cell">
          <CloseIcon color="#C44556" />
          <TextLabel className="legend-text">
            { i18nT('rpo_non_compliant', 'RPO Non-Compliant') }
          </TextLabel>
        </FlexItem>
      </FlexLayout>
    );
  }

  // Set the correspoding componets for each files route
  render() {
    return (
      <StackingLayout
        className="fs-list-root"
        padding="0px"
        itemSpacing="0px"
      >
        <div>
          <EntityBrowser { ...this.props.ebConfig } />
          { this.renderTableFooter() }
        </div>
      </StackingLayout>
    );
  }

}

export default ProtectedFileServers;
