//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The Minerva UI Sub-Application
//
import React from 'react';
import {
  HashRouter as Router
} from 'react-router-dom';

// Absolute css
import '@nutanix-ui/prism-reactjs/dist/index.css';
import '@nutanix-ui/ntnx-react-charts/dist/index.css';

// Containers
import {
  Files,
  ModalContainer
} from './containers';

// App Level CSS
import './App.less';

class App extends React.Component {

  render() {
    // Finally all is good, show the main app
    return (
      <div className="file-server-app">
        <ModalContainer />
        <Router>
          <Files />
        </Router>
      </div>
    );
  }

}

export default App;
