const auth = require('./middleware/auth')
const permission = require('./middleware/permission')

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
