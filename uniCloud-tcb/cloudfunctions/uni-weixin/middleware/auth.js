const db = uniCloud.database();
const dbCmd = db.command;
module.exports = () => {
    // 返回中间件函数
    return async function auth(ctx, next) {
        // 校验 token
       await next() // 执行后续中间件
    }
}
