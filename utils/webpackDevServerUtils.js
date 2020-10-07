const url = require('url');
const detect = require('detect-port-alt');

function prepareUrls(protocol, host, port, pathname = '/') {
    const formatUrl = (hostname) =>
        url.format({
            protocol,
            hostname,
            port,
            pathname,
        });

    const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
    let prettyHost;
    if (isUnspecifiedHost) {
        prettyHost = 'localhost';
    } else {
        prettyHost = host;
    }
    const localUrlForBrowser = formatUrl(prettyHost);
    return {
        localUrlForBrowser,
    };
}

function choosePort(host, defaultPort) {
    return detect(defaultPort, host).then(
        (port) =>
            new Promise((resolve) => {
                if (port === defaultPort) {
                    return resolve(port);
                }
                const message =
                    process.platform !== 'win32' &&
                    defaultPort < 1024 &&
                    !isRoot()
                        ? `Admin permissions are required to run a server on a port below 1024.`
                        : `Something is already running on port ${defaultPort}.`;
                if (isInteractive) {
                    clearConsole();
                    const existingProcess = getProcessForPort(defaultPort);
                    const question = {
                        type: 'confirm',
                        name: 'shouldChangePort',
                        message:
                            chalk.yellow(
                                message +
                                    `${
                                        existingProcess
                                            ? ` Probably:\n  ${existingProcess}`
                                            : ''
                                    }`
                            ) +
                            '\n\nWould you like to run the app on another port instead?',
                        default: true,
                    };
                    inquirer.prompt(question).then((answer) => {
                        if (answer.shouldChangePort) {
                            resolve(port);
                        } else {
                            resolve(null);
                        }
                    });
                } else {
                    console.log(chalk.red(message));
                    resolve(null);
                }
            }),
        (err) => {
            throw new Error(
                chalk.red(
                    `Could not find an open port at ${chalk.bold(host)}.`
                ) +
                    '\n' +
                    ('Network error message: ' + err.message || err) +
                    '\n'
            );
        }
    );
}

module.exports = {
    choosePort,
    prepareUrls,
};
