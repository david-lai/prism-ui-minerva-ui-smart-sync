//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The plugin webpack configuration (production)
//
/* eslint-env node */

var config = require('./webpack.common.js');
var webpack = require('webpack');

var prodConfig = Object.assign({}, config, {
  bail: true,
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
});

module.exports = prodConfig;