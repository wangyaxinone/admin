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
			tenantId,
			packingPrice,
			packingPriceEvery,
			stockNumber
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
			tenantId,
			packingPrice,
			packingPriceEvery,
			stockNumber
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
			tenantId,
			packingPrice,
			packingPriceEvery,
			stockNumber
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
			tenantId,
			packingPrice,
			packingPriceEvery,
			stockNumber
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
	async select() {
		return await this.service.goods.goods.select(this.ctx.data);
	}
	async updateGoods() {
		return await this.service.goods.goods.updateGoods(this.ctx.data);
	}
}
