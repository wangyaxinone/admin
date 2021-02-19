const {
    Service
} = require('uni-cloud-router')
module.exports = class UserService extends Service {
	async weixinLogin(params) {
		const {code, tenantId} = params;
		let {data: tenandList} = await this.db.collection('opendb-admin-tenant').where({
			_id: tenantId
		}).get();
		const {appid,secret} = tenandList[0]
		if(!appid || !secret) {
			this.ctx.throw('FORBIDDEN', `appid 和 secret不能为空`);
			return;
		}
		var res = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
			method: 'GET',
			data: {
				appid: appid,
				secret: secret,
				js_code: code,
				grant_type: 'authorization_code'
			},
			dataType: 'json'
		})
		if(res.data && res.data.openid) {
			return res
		}else{
			this.ctx.throw('error', `微信登录失败 ${res.data.errmsg}`);
		}
		
	}
}
