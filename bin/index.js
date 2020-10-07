#!/usr/bin/env node

// 监听全局异常错误
process.on('unhandledRejection', (err) => {
    throw err;
});

// node内置api，执行命令行
const spawn = require('cross-spawn');
// 子命令
const args = process.argv.slice(2);

const scriptIndex = args.findIndex((x) => x === 'build' || x === 'start');
// 识别要执行的脚本
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
// 保留前面的命令代码，后面一起执行
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (['build', 'start'].includes(script)) {
    // 执行脚本
    const result = spawn.sync(
        'node',
        nodeArgs
            .concat(require.resolve(`../scripts/${script}`))
            .concat(args.slice(scriptIndex + 1)),
        { stdio: 'inherit' }
    );

    // 进程信号
    if (result.signal) {
        if (result.signal === 'SIGKILL') {
            console.log(
                'The build failed because the process exited too early. ' +
                    'This probably means the system ran out of memory or someone called ' +
                    '`kill -9` on the process.'
            );
        } else if (result.signal === 'SIGTERM') {
            console.log(
                'The build failed because the process exited too early. ' +
                    'Someone might have called `kill` or `killall`, or the system could ' +
                    'be shutting down.'
            );
        }
        process.exit(1);
    }

    process.exit(result.status);
} else {
    console.log(`Unknown script "${script}"`);
}
