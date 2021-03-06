var path = require('path');
var webpack = require('webpack');

var plugins = [];

var minimize = process.argv.indexOf('--minimize') === -1 ? false : true;

if(minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

plugins.push(new webpack.HotModuleReplacementPlugin())

module.exports = {
  entry: {
    javascript: './src/main.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.js'
  },
  devServer: {
    hot: true,
    open: true      
  },
  // for modules
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [{
            loader: 'babel-loader'
        }],
        exclude: /node_modules/,
        include: '/node_modules/d3-adjacency-matrix-layout'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "file-loader?name=build/[name].[ext]"
        // loader: 'file-loader'
      },
      {
        test: /\.html$/,
        loader: "file-loader?name=[name].[ext]"
      }
    ]
  },
  plugins: plugins
};
