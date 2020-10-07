const paths = require('./paths');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: [paths.appIndexJs].filter(Boolean),
    output: {
        filename: 'static/js/bundle.js',
        publicPath: '/'
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
        }),
        new webpack.HotModuleReplacementPlugin(), // 热替换
    ],
};
