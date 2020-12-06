const {
	Controller
} = require('uni-cloud-router')
module.exports = class UserController extends Controller {
	async add() {
		const {
			goodsSmallImg,
			goodsBigImg,
			goodsName,
			deptId,
			goodsType,
			unit,
			goodsCost,
			goodsPrice,
			goodsVipPrice,
			goodsAttr,
			status,
			remark,
			tenantId
		} = this.ctx.data
		return await this.service.goods.goods.add({
			goodsSmallImg,
			goodsBigImg,
			goodsName,
			deptId,
			goodsType,
			unit,
			goodsCost,
			goodsPrice,
			goodsVipPrice,
			goodsAttr,
			status,
			remark,
			tenantId
		});
	}
	async update() {
		const {
			_id,
			goodsSmallImg,
			goodsBigImg,
			goodsName,
			deptId,
			goodsType,
			unit,
			goodsCost,
			goodsPrice,
			goodsVipPrice,
			goodsAttr,
			status,
			remark,
			tenantId
		} = this.ctx.data
		return await this.service.goods.goods.update({
			_id,
			goodsSmallImg,
			goodsBigImg,
			goodsName,
			deptId,
			goodsType,
			unit,
			goodsCost,
			goodsPrice,
			goodsVipPrice,
			goodsAttr,
			status,
			remark,
			tenantId
		});
	}
	async remove() {
		const {
			_ids,
		} = this.ctx.data
		return await this.service.goods.goods.remove(_ids);
	}
	async list() {
		return await this.service.goods.goods.list(this.ctx.data);
	}
}
