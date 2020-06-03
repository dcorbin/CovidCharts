const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SvgMapGeneratorPlugin = require('./webpack/svg_map_generator_plugin');
let config = {
    entry: {
        main: './src/js/index.js',
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
            template: __dirname + '/src/index-template.html'
        }),
        new SvgMapGeneratorPlugin({
                normalizers: [
                    {
                        test: /^GA$/,
                        file: path.resolve('webpack/normalize-GA.js')
                    },
                    {
                        test: /^US$/,
                        file: path.resolve('webpack/normalize-US.js')
                    }
                ]
            }
        )
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
                test: /\.svg-map$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: path.resolve('webpack/svg_map_loader.js'),
                        options: {
                        }
                    }
                ]
            },
        ],
    },
};

module.exports = function(env, argv) {
    console.log(`MODE: ${argv.mode}`)
    let copyPatterns = [
            { from: '**/*.{svg,png,css}', to: '.', context: path.resolve(__dirname, 'src', 'web')},
        ]

    if (argv.mode === 'development') {
        copyPatterns.push({from:'api/data/GA-By-County.json', to: './api/data', context: path.resolve(__dirname, 'src', 'web')})
    }
    if (argv.mode === 'production') {
        config.performance = {
            hints: false
        }
    }
    config.plugins.push(new CopyPlugin(copyPatterns))
    return config
}