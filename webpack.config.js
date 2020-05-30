const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

let config = {
    plugins: [
        new CopyPlugin([
            {from: 'web', to: '.'},
        ], {}),
    ],
    target: "web",
    mode: "development",
    devtool: 'source-map',
    resolve: {
        alias: {
            Maps: path.resolve(__dirname, 'generated/maps'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ],
    },
};

module.exports = function(env, argv) {
    if (argv.mode === 'development') {
        config.plugins.push(new CopyPlugin([
            { from: 'web-dev', to: '.' },
        ], {}))
    }
    return config
}