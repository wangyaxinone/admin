const uniID = require('uni-id')
const db = uniCloud.database();
const dbCmd = db.command;
module.exports = (options) => {
    // 初始化 uniID 配置
    if (options) {
        uniID.init(options)
    }
    // 返回中间件函数
    return async function auth(ctx, next) {
        // 校验 token
        const auth = await uniID.checkToken(ctx.event.uniIdToken)
        if (auth.code) {
            // 校验失败，抛出错误信息
            ctx.throw('TOKEN_INVALID', `${auth.message}，${auth.code}`)
        }
        ctx.auth = auth // 设置当前请求的 auth 对象
		ctx.tenantList = [];
		let currentTenantId = ctx.auth.userInfo.tenantId;
		ctx.tenantList.push(currentTenantId);
		let {
			data: tenants
		} = await db.collection('opendb-admin-tenant')
		.where({
			parentTenants: dbCmd.all([currentTenantId])
		})
		.field({
			'_id': true
		})
		.get();
		if(tenants && tenants.length) {
			tenants.forEach((item)=>{
				ctx.tenantList.push(item._id);
			})
		}
		console.log(ctx.tenantList);
        await next() // 执行后续中间件

        const {
            token,
            tokenExpired
        } = auth
        if (token && tokenExpired) {
            Object.assign(ctx.body, {
                token,
                tokenExpired
            })
        }
    }
}
