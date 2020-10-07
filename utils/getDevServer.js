const path = require('path');
const fs = require('fs');
const paths = require('../config/paths');

module.exports = (function () {
    const files = ['server.js'];
    let devServerPath = '';

    for (let i = 0; i < files.length; i++) {
        const filePath = path.resolve(paths.appPath, files[i]);
        // 按顺序读取，仅一个
        if (fs.existsSync(filePath)) {
            devServerPath = filePath;
            break;
        }
    }

    if (devServerPath) {
        return require(devServerPath);
    }
})();
