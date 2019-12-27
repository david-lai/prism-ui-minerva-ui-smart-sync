//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
// Standalone app index file
//
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/prism-reactjs/dist/index.css';
// App Level CSS
import './App.less';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
