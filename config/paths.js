const path = require('path');
const fs = require('fs');

// 获取当前项目路径
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = ['js', 'jsx', 'json'];

const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find((extension) =>
        fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );

    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};

module.exports = {
    appPath: resolveApp('.'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    appBuild: resolveApp('build'),
    appSrc: resolveApp('src'),
    appPublic: resolveApp('public'),
    moduleFileExtensions: moduleFileExtensions,
};
