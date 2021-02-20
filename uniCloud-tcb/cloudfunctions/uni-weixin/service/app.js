const {
    Service
} = require('uni-cloud-router')
const {getServerDate} = require('../utils.js')
module.exports = class UserService extends Service {
	async weixinLogin(params) {
		var date = getServerDate();
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
			var {data: members} = await this.db.collection('opendb-admin-member').where({
				openid: res.data.openid
			})
			.field({
				openid: false,
				session_key: false
			})
			.get();
			if(!members || !members.length) {
				var data = {
					update_date: date,
					create_date: date,
					openid: res.data.openid,
					session_key: res.data.session_key
				}
				await this.db.collection('opendb-admin-member').add(data);
				var {data: members} = await this.db.collection('opendb-admin-member').where({
					openid: res.data.openid
				})
				.field({
					openid: false,
					session_key: false
				})
				.get();
			}
			return members[0];
		}else{
			this.ctx.throw('error', `微信登录失败 ${res.data.errmsg}`);
		}
		
	}
}
