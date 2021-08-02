const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/js/script.js'
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
  },
  node: {
    net: 'empty',
    tls: 'empty',
    fs : 'empty',  // webpack error without this, Can't resolve 'net' in './node_modules/ib/lib'
  },
  optimization: {
    minimize: true
  }
};
