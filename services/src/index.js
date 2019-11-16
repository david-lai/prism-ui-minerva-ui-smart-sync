import React from 'react';
import 'babel-polyfill';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/prism-reactjs/dist/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
