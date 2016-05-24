var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require('extendify')({ isDeep: true, arrays: 'concat' });
var devConfig = require('./webpack.config.dev');
var prodConfig = require('./webpack.config.prod');
var isDevelopment = process.env.ASPNETCORE_ENVIRONMENT === 'Development';

module.exports = merge({
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.scss'],
    modulesDirectories: [ 'node_modules', 'ClientApp' ]
  },
  module: {
    loaders: [
      { test: /\.ts(x?)$/, include: /ClientApp/, loader: 'babel-loader' },
      { test: /\.ts(x?)$/, include: /ClientApp/, loader: 'ts-loader' },
      { 
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract(
          // activate source maps via loader query
          'css?sourceMap!' +
          'sass?sourceMap' +
          '&includePaths[]=' +
            encodeURIComponent(path.resolve(__dirname,
            '../node_modules')) 
        )
      },
      {
        test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  entry: {
    main: ['./ClientApp/boot-client.tsx'],
  },
  output: {
    path: path.join(__dirname, 'wwwroot', 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  plugins: [
    new ExtractTextPlugin('css/app.css'),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./wwwroot/dist/vendor-manifest.json')
    })
  ]
}, isDevelopment ? devConfig : prodConfig);

