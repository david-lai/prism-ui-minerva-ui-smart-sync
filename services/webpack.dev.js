/* eslint-disable no-console */
//
// Copyright (c) 2019 Nutanix Inc. All rights reserved.
//
// The standalone app webpack configuration (development)
//
const path = require('path');
const chalk = require('chalk');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Constant with our paths
const paths = {
  public: path.resolve(__dirname, 'public'),
  dist: path.resolve(__dirname, 'dist'),
  src: path.resolve(__dirname, 'src')
};

let proxy = {};
let https = false;

// Proxy Configuration for override of the default
if (process.env.PROXY && process.env.USERNAME && process.env.PASSWORD) {
  const pConfig = {
    auth: `${process.env.USERNAME}:${process.env.PASSWORD}`,
    target: process.env.PROXY,
    secure: false,
    changeOrigin : true,
    ws : true,
    xfwd : true
  };

  proxy = {

  };
  https = (process.env.PROXY.indexOf('https') === 0);
} else {
  console.log(chalk.red('Error: Proxy to ObjectStore Service Manger not specified.'));
  console.log(chalk.red('Examples: '));
  console.log(chalk.red('USERNAME=admin PASSWORD=Nutanix.123 PROXY=\'http://10.4.96.132:9001\' npm run dev'));
  console.log(chalk.red('USERNAME=admin PASSWORD=Nutanix.123 PROXY=\'http://localhost:5000\' npm run dev'));
  process.exit();
}

console.log('Starting Server -- Proxying to:',
  chalk.yellow(JSON.stringify(proxy)));


// Webpack configuration
//----------------------
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    https,
    proxy,
    port: 3000
  },
  entry: ['babel-polyfill', path.join(paths.src, 'index.js')],
  output: {
    path: paths.dist,
    filename: 'app.bundle.js'
  },
  // Tell webpack to use html plugin
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.public, 'index.html')
    }),
    new ExtractTextPlugin('style.bundle.css')
  ],
  // Loaders configuration
  // We are telling webpack to use "babel-loader" for .js and .jsx files
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      // CSS loader for CSS files
      // Files will get handled by css loader and then passed to the extract text plugin
      // which will write it to the file we defined above
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      // File loader for image assets -> ADDED IN THIS STEP
      // We'll add only image extensions, but you can add things like svgs, fonts and videos
      {
        test: /\.(woff|woff2|eot|eot\?iefix|ttf|svg|gif|png|jpg)$/,
        loader: 'file-loader'
      },
      // File loader for image assets -> ADDED IN THIS STEP
      // We'll add only image extensions, but you can add things like svgs, fonts and videos
      {
        test: /\.(woff|woff2|eot|eot\?iefix|ttf|svg|gif|png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    ]
  },
  // Enable importing JS files without specifying their's extension
  resolve: {
    alias: {
      // NOTE: This is temp, until EB is published as a lib
      ebr: path.resolve(__dirname, 'node_modules', 'ebr')
    },
    extensions: ['.js', '.jsx']
  }
};
