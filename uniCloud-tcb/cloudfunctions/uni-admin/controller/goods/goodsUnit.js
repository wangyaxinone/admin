const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			name,
			tenantId,
			sort,
			comment
		} = this.ctx.data
		return await this.service.goods.goodsUnit.add({
			name,
			tenantId,
			sort,
			comment
		});
	}
	async update() {
		const {
			_id,
			name,
			tenantId,
			sort,
			comment
		} = this.ctx.data
		return await this.service.goods.goodsUnit.update({
			_id,
			name,
			tenantId,
			sort,
			comment
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.goods.goodsUnit.remove(_ids);
	}
	async list() {
		return await this.service.goods.goodsUnit.list(this.ctx.data);
	}
	async select() {
		return await this.service.goods.goodsUnit.select(this.ctx.data);
	}
}
