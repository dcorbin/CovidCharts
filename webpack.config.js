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
           use: {
               loader: 'babel-loader',
               options:  {
                   presets: ['@babel/preset-env', '@babel/preset-react'],
                   plugins: ['@babel/plugin-proposal-object-rest-spread']
               }
           },
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
