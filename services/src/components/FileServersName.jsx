//
// Copyright (c) 2020 Nutanix Inc. All rights reserved.
//
// The file servers name component
//
import React from 'react';
import { Link } from '@nutanix-ui/prism-reactjs';
import PropTypes from 'prop-types';

// Utils
import { MODAL_TYPE } from '../utils/AppConstants';

class FileServersName extends React.Component {

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

    this.handleShowFsDetailsModal = this.handleShowFsDetailsModal.bind(this);
  }

  // Handler to launch create case modal
  handleShowFsDetailsModal = () => {
    this.props.openModal(MODAL_TYPE.FILE_SERVER_DETAILS, this.props.options);
  }

  render() {
    return (
      <Link className="manage-link"
        onClick={ this.handleShowFsDetailsModal }>
        { this.props.options.entity.name }
      </Link>
    );
  }

}

FileServersName.propTypes = {
  options: PropTypes.object,
  name: PropTypes.string,

  openModal: PropTypes.func
};

export default FileServersName;
