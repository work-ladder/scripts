// 读取项目自定义配置文件
const path = require('path');
const fs = require('fs');
const paths = require('../config/paths');

module.exports = (function () {
    const files = ['webpack.config.js', 'webpack.js'];
    let webpackPath = '';

    for (let i = 0; i < files.length; i++) {
        const filePath = path.resolve(paths.appPath, files[i]);
        // 按顺序读取，仅一个
        if (fs.existsSync(filePath)) {
            webpackPath = filePath;
            break;
        }
    }

    if (webpackPath) {
        return require(webpackPath);
    }
})();
