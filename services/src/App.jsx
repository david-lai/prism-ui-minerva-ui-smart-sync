//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The Service Chains Sub-Application
//
import React from 'react';
import FileServers from './components/FileServers';

// App Level CSS
import './App.less';

class App extends React.Component {

  render() {
    // Finally all is good, show the main app
    return (
      <div className="file-server-app">
        <FileServers />
      </div>
    );
  }

}

export default App;
