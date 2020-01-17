//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The Minerva UI Sub-Application
//
import React from 'react';
import FileServers from './components/FileServers';
// Containers
import { ModalContainer } from './containers';

// App Level CSS
import './App.less';

class App extends React.Component {

  render() {
    // Finally all is good, show the main app
    return (
      <div className="file-server-app">
        <ModalContainer />
        <FileServers />
      </div>
    );
  }

}

export default App;
