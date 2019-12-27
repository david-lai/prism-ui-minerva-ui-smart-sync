//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The common webpack configuration
//
/* eslint-env node */
var path = require('path');
var webpack = require('webpack');
var externals = require('prism-subapps-react-common/tools/externals');

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    filename: 'serviceChains.js'
  },
  externals: Object.assign({}, externals, {
    // Add any other external dependencies here.
  }),
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
        test: /\.(woff|woff2|eot|eot\?iefix|ttf|svg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ]
  }
};
