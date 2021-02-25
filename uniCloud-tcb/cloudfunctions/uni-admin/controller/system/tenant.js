const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			name,
			parent_id,
			type,
			enable,
			address,
			tenantPeople,
			tenantPhone,
			longitude,
			latitude
		} = this.ctx.data
		return await this.service.system.tenant.add({
			name,
			parent_id,
			type,
			enable,
			address,
			tenantPeople,
			tenantPhone,
			longitude,
			latitude
		});
	}
	async update() {
		const {
			_id,
			name,
			parent_id,
			type,
			address,
			tenantPeople,
			tenantPhone,
			enable,
			longitude,
			latitude
		} = this.ctx.data
		return await this.service.system.tenant.update({
			_id,
			name,
			parent_id,
			type,
			address,
			tenantPeople,
			tenantPhone,
			enable,
			longitude,
			latitude
		});
	}
	async updatePush() {
		const {
			_id,
			path,
			appkey,
			logo
		} = this.ctx.data
		return await this.service.system.tenant.updatePush({
			_id,
			path,
			appkey,
			logo
		});
	}
	async updateXiaoCHengXu() {
		const {
			_id,
			appid,
			secret,
		} = this.ctx.data
		return await this.service.system.tenant.updateXiaoCHengXu({
			_id,
			appid,
			secret,
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.system.tenant.remove(_ids);
	}
	async list() {
		return await this.service.system.tenant.list(this.ctx.data);
	}
	
	async tree() {
		const {
			name,
		} = this.ctx.data
		return await this.service.system.tenant.tree(name);
	}
}
