'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (err) => {
    throw err;
});

const url = require('url');
const chalk = require('chalk');
const open = require('open');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const configFactory = require('../config/webpack.config');
const clearConsole = require('../utils/clearConsole');
const { choosePort, prepareUrls } = require('../utils/webpackDevServerUtils');
const getDevServer = require('../utils/getDevServer');

const isInteractive = process.stdout.isTTY;

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
    console.log(
        chalk.cyan(
            `Attempting to bind to HOST environment variable: ${chalk.yellow(
                chalk.bold(process.env.HOST)
            )}`
        )
    );
    console.log(
        `If this was unintentional, check that you haven't mistakenly set it in your shell.`
    );
    console.log();
}

choosePort(HOST, DEFAULT_PORT).then((port) => {
    if (port == null) {
        return;
    }

    // 获取webpack的开发配置
    const config = configFactory('development');

    const devServerConfig = config.devServer || {};
    delete config.devServer;

    const compiler = webpack(config);

    if (typeof getDevServer === 'function') {
        getDevServer(compiler, { ...devServerConfig, port, HOST });
        return;
    }

    const devServer = new WebpackDevServer(compiler, {
        ...devServerConfig,
    });

    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

    const urls = prepareUrls(protocol, HOST, port);

    devServer.listen(port, HOST, (err) => {
        if (err) {
            return console.log(err);
        }
        if (isInteractive) {
            clearConsole();
        }

        console.log(chalk.cyan('Starting the development server...\n'));
        open(urls.localUrlForBrowser);
    });
});
