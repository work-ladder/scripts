const { merge } = require('webpack-merge');
const getConfig = require('../utils/getWebpackConfig');

module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    const config = isEnvProduction
        ? require('./prod')
        : isEnvDevelopment
        ? require('./dev')
        : {};

    if (typeof getConfig === 'function') {
        config = getConfig(webpackEnv, { ...config });
    } else if (getConfig) {
        config = merge(config, getConfig);
    }

    return config;
};
