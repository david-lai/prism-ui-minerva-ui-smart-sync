//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// Alert name cell component
//
import React from 'react';
import { Link } from '@nutanix-ui/prism-reactjs';
import PropTypes from 'prop-types';

// Utils
import { MODAL_TYPE } from '../utils/AppConstants';

class EventTitleCell extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.object,
    openModal: PropTypes.func
  };

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
    this.handleShowEventModal = this.handleShowEventModal.bind(this);
  }

  // Handler to launch alert info modal
  handleShowEventModal = () => {
    this.props.openModal(MODAL_TYPE.EVENT_INFO, this.props.options);
  }

  render() {
    return (
      <Link className="manage-link"
        onClick={ this.handleShowEventModal }>
        { this.props.value }
      </Link>
    );
  }

}

export default EventTitleCell;
