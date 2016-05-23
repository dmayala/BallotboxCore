var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var isDevelopment = process.env.ASPNETCORE_ENVIRONMENT === 'Development';

module.exports = {
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  entry: {
    vendor: ['react', 'react-dom', 'react-router'],
  },
  output: {
    path: path.join(__dirname, 'wwwroot', 'dist'),
    filename: '[name].js',
    library: '[name]_[hash]',
  },
  plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DllPlugin({
        path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
        name: '[name]_[hash]'
      })
  ].concat(isDevelopment ? [] : [
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })
  ])
};
