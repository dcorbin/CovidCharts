const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin( [
        { from: 'web', to: '.' },
      ],
        {})
  ],
  target: "web",
  mode: "development",
  module: {
   rules: [
       {
           test: /\.js$/,
	   exclude: /node_modules/,
           loader: 'babel-loader',
       },
       {
         test: /\.css$/,
         use: [ 'style-loader', 'css-loader' ],
       },
       {
           test: /\.js$/,
           use: ["source-map-loader"],
           enforce: "pre"
       }
     ],
   },
}
