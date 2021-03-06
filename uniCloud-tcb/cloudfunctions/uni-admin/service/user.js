const {
    Service
} = require('uni-cloud-router')
const uniID = require('uni-id')
module.exports = class UserService extends Service {
    async login({
        username,
        password
    }) {
        const res = await uniID.login({
            username,
            password,
            needPermission: true,
			queryField: ['username', 'email', 'mobile']
        })
        if (res.code) {
            return res
        }
        await this.checkToken(res.token)
        if (this.ctx.auth.role.includes('admin')) {
            return res
        }
		
		this.ctx.tenantList = [];
		let currentTenantId = this.ctx.auth.userInfo.tenantId;
		this.ctx.tenantList.push(currentTenantId);
		let roles = await this.db.collection('uni-id-roles')
		.where({
			_id: this.db.command.in(this.ctx.auth.userInfo.role)
		})
		.get();
		var dataPermission = '';
		var isTenantAdminOrAdmin = false;
		if(roles.data && roles.data.length) {
			roles.data.forEach((role)=>{
				if(role.type == 1) {
					isTenantAdminOrAdmin = true;
				}
				if(!dataPermission || role.dataPermission < dataPermission) {
					dataPermission = role.dataPermission;
				}
			})
		}
		this.ctx.dataPermission = dataPermission;
		let {
			data: tenants
		} = await this.db.collection('opendb-admin-tenant')
		.where({
			parentTenants: this.db.command.all([currentTenantId])
		})
		.field({
			'_id': true
		})
		.get();
		if(tenants && tenants.length) {
			tenants.forEach((item)=>{
				this.ctx.tenantList.push(item._id);
			})
		}
		let {
		    data: menuList
		} = await this.db.collection('opendb-admin-menus').where({
			_id: this.db.command.in(this.ctx.auth.permission)
		}).field({
			'menu_id': true
		}).orderBy('sort', 'asc').get();
		var permission = {};
		menuList.forEach((item)=>{
			permission[item.menu_id] = true;
		})
		
		await this.db.collection('uni-id-users').doc(this.ctx.auth.uid).update({
			dataPermission: this.ctx.dataPermission,
			tenantList: this.db.command.set(this.ctx.tenantList),
			isTenantAdminOrAdmin,
			permission
		});
        const navMenu = await this.service.system.menus.navMneuOrBtnByRole(1,this.ctx.data)
        if (navMenu.length) {
            return res
        }
        return {
            code: 10001,
            message: '该账号没有配置角色权限，暂无权限登录！！！'
        }
    }

    async logout(token) {
        return await uniID.logout(token)
    }

    async checkToken(token) {
        const auth = await uniID.checkToken(token)
        if (auth.code) {
            // 校验失败，抛出错误信息
            this.ctx.throw('TOKEN_INVALID', `${auth.message}，${auth.code}`)
        }
        this.ctx.auth = auth // 设置当前请求的 auth 对象
    }

    async hasAdmin() {
        const {
            total
        } = await this.db.collection('uni-id-users').where({
            role: 'admin'
        }).count()

        return !!total
    }
	
	async weixinLogin(params) {
		const {code} = params;
		var res = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
			method: 'GET',
			data: {
				appid: goeasyConfig.appkey,
				secret: `${tenantId}-orderChange`,
				js_code: code,
				grant_type: 'authorization_code'
			},
			dataType: 'json'
		})
		return res 
	}
}
