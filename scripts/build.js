'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', (err) => {
    throw err;
});

const webpack = require('webpack');
const chalk = require('chalk');
const fs = require('fs-extra');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const formatWebpackMessages = require('../utils/formatWebpackMessages');

// 确保文件夹为空
fs.emptyDirSync(paths.appBuild);

// 将public中的文件移动到build里
copyPublicFolder();

// 获取webpack的开发配置
const config = configFactory('production');

console.log('Creating an optimized production build...');

build()
    .then(
        ({ warnings }) => {
            if (warnings.length) {
                console.log(chalk.yellow('Compiled with warnings.\n'));
                console.log(warnings.join('\n\n'));
                console.log(
                    '\nSearch for the ' +
                        chalk.underline(chalk.yellow('keywords')) +
                        ' to learn more about each warning.'
                );
                console.log(
                    'To ignore, add ' +
                        chalk.cyan('// eslint-disable-next-line') +
                        ' to the line before.\n'
                );
            } else {
                console.log(chalk.green('Compiled successfully.\n'));
            }
        },
        (err) => {
            console.log(err);
            console.log(chalk.red('Failed to compile.\n'));
            // printBuildError(err);
            process.exit(1);
        }
    )
    .catch((err) => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    });

function build() {
    const compiler = webpack(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            let messages;
            if (err) {
                if (!err.message) {
                    return reject(err);
                }

                let errMessage = err.message;

                // Add additional information for postcss errors
                if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
                    errMessage +=
                        '\nCompileError: Begins at CSS selector ' +
                        err['postcssNode'].selector;
                }

                messages = formatWebpackMessages({
                    errors: [errMessage],
                    warnings: [],
                });
            } else {
                messages = formatWebpackMessages(
                    stats.toJson({ all: false, warnings: true, errors: true })
                );
            }
            if (messages.errors.length) {
                // 仅保留第一个错误
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }
                return reject(new Error(messages.errors.join('\n\n')));
            }

            return resolve({
                warnings: messages.warnings,
            });
        });
    });
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: (file) => file !== paths.appHtml,
    });
}
