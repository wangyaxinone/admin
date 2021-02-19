const auth = require('./middleware/auth')

module.exports = {
    debug: true, // 输出调试信息
    baseDir: __dirname,
    middleware: [
        [
            auth(), // uniId 校验 token 中间件
            {
                name: 'auth',
                enable: true,
                ignore: ['app/weixinLogin']
            }
        ],
    ]
}
