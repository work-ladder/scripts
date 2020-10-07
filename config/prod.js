const paths = require('./paths');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: false,
    entry: [paths.appIndexJs].filter(Boolean),
    output: {
        path: paths.appBuild,
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    },
    resolve: {
        extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
        alias: {
            '~': paths.appSrc,
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    fix: true,
                },
                include: paths.appSrc,
            },
            {
                test: /\.(js|jsx)$/,
                include: paths.appSrc,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs: 3,
                                targets: {
                                    ie: 10,
                                },
                            },
                        ],
                        '@babel/react',
                    ],
                },
            },
            {
                test: /\.css$/,
                include: paths.appSrc,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.svg$/,
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new UglifyJsPlugin({
            sourceMap: true,
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 5,
                },
                react: {
                    test: /react[-.*]/,
                    chunks: 'initial',
                    name: 'react',
                    priority: 10,
                },
                common: {
                    chunks: 'async',
                    minChunks: 2,
                    name: 'common',
                },
            },
        },
        runtimeChunk: 'single',
    },
};
