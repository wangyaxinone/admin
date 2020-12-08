const {
	Controller
} = require('uni-cloud-router')
const uniID = require('uni-id')
module.exports = class UserController extends Controller {
	async add() {
		const {
			username,
			password,
			tenantId,
			nickname,
			gender,
			status,
			mobile,
			email,
			comment,
			dept,
			role
		} = this.ctx.data
		return await this.service.system.user.add({
			username,
			password,
			tenantId,
			nickname,
			gender,
			status,
			mobile,
			email,
			comment,
			dept,
			role
		});
	}
	async update() {
		const {
			_id,
			username,
			tenantId,
			nickname,
			gender,
			status,
			mobile,
			email,
			comment,
			dept,
			role
		} = this.ctx.data
		return await this.service.system.user.update({
			_id,
			username,
			tenantId,
			nickname,
			gender,
			status,
			mobile,
			email,
			comment,
			dept,
			role
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.system.user.remove(_ids);
	}
	async list() {
		return await this.service.system.user.list(this.ctx.data);
	}
	async create() {
		var data = [];
		for(var i =0;i<20000;i++){
			data.push({
				username: `demo3-${i}`,
				password: await uniID.encryptPwd('123456'),
				status: 0
			})
		}
		return await this.service.system.user.create(data);
	}
}
