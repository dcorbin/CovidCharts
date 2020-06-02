const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SvgMapGeneratorPlugin = require('./webpack/svg_map_generator_plugin');
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
        }),
        new SvgMapGeneratorPlugin()
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
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: path.resolve('webpack/svg_map_loader.js'),
                        options: {}
                    }
                ]
            },
        ],
    },
};

module.exports = function(env, argv) {
    console.log(`MODE: ${argv.mode}`)
    let copyPatterns = [
            { from: 'web', to: '.' },
        ]

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