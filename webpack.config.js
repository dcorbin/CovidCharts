const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
    entry: {
        main: './src/index.js',
    },

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Corbin's Covid Charting",
            template: __dirname + '/src/index.html'
        })
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
    let copyPatterns = [
            { from: 'web', to: '.' },
            { from: 'generated/api', to: './api'}
        ]

    console.log(`MODE: ${argv.mode}`)
    if (argv.mode === 'development') {
        copyPatterns.push({ from: 'web-dev', to: '.' })
    }
    if (argv.mode === 'production') {
        config.performance = {
            hints: false
        }
    }
    config.plugins.push(new CopyPlugin(copyPatterns))
    return config
}