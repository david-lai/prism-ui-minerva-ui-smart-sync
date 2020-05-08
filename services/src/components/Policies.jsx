//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Policies main view
//
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  withRouter
} from 'react-router-dom';
import {
  Button,
  FlexLayout,
  FlexItem,
  PlusIcon,
  StackingLayout
} from '@nutanix-ui/prism-reactjs';

import {
  openModal
} from '../actions';

import i18n from '../utils/i18n';

import AppConstants from '../utils/AppConstants';

// Helper to translate strings from this module
const i18nT = (key, defaultValue, replacedValue) => i18n.getInstance().t(
  'Policies', key, defaultValue, replacedValue);

class Policies extends React.Component {

  static propTypes = {
    goToPath: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    location: PropTypes.object
  };

  handleNewPolicyClick = (e) => {
    this.props.openModal(
      AppConstants.MODAL_TYPE.CREATE_NEW_POLICY,
      {
        goToPath: this.props.goToPath,
        closeOnEsc: true
      }
    );
    const newPath = `/${AppConstants.POLICIES_TAB_KEY}/new`;
    if (this.props.location.pathname !== newPath) {
      this.props.goToPath(newPath);
    }
  }

  render() {
    return (
      <StackingLayout
        padding="0px"
        itemSpacing="0px"
      >
        <FlexLayout>
          <FlexItem>
            <Button className="create-policy-button" onClick={ this.handleNewPolicyClick }>
              <PlusIcon size="small" />
              { i18nT('New_policy', 'New Policy') }
            </Button>
          </FlexItem>
        </FlexLayout>
      </StackingLayout>
    );
  }

  componentDidMount() {
    const pathname = this.props.location.pathname;
    if (pathname.substring(pathname.lastIndexOf('/') + 1) === 'new') {
      this.handleNewPolicyClick();
    }
  }

}


const mapStateToProps = null;

const mapDispatchToProps = dispatch => {
  return {
    openModal: (type, options) => dispatch(openModal(type, options))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Policies));
