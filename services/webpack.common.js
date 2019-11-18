//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The common webpack configuration
//
/* eslint-env node */
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  externals: {
    'lodash': 'lodash',
    'react': 'react',
    'react-dom': 'react-dom',
    'react-redux': 'react-redux',
    'redux': 'redux',
    'redux-logger': 'redux-logger',
    'prop-types': 'prop-types'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // For loading fonts.
      // This is only needed for the styleguide.
      {
        test: /\.(woff|woff2|eot|eot\?iefix|ttf|svg|gif|png|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      // For loading fonts.
      // This is only needed for the styleguide.
      {
        test: /\.(woff|woff2|eot|eot\?iefix|ttf|svg|gif|png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    ]
  }
};
