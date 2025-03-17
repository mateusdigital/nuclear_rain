const path              = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry : './src/MissileCommand.js', // Adjust the entry point as needed
  output : {path : path.resolve(__dirname, 'dist'), filename : 'bundle.js'},
  module : {
            rules : [ {
      test : /\.js$/,
      exclude : /node_modules/,
      use : {
        loader : 'babel-loader',
        options : {presets : [ '@babel/preset-env' ]}
      }
    } ]
  },
  plugins : [ new CopyWebpackPlugin({
            patterns :
    [
      {from : './fonts', to : 'fonts'},
            {from : 'libs', to : 'libs'},
            {from : 'res', to : 'res'},
            {from : 'src', to : 'src'},
            {from : 'css', to : 'css'},
            {from : 'index.html', to : 'index.html'}
    ]
  }
    ) ]
};
