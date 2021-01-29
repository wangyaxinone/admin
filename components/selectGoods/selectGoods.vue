<template>
	<view>
		<el-dialog v-loading="loading" top="3vh" title="点菜" append-to-body :visible.sync="dialogVisible" width="60%">
			<el-form :inline="true" :model="goodsForm" class="demo-form-inline">
				<el-form-item label="菜品名称"><el-input size="mini" v-model="goodsForm.goodsName" placeholder="菜品名称"></el-input></el-form-item>
				<el-form-item>
					<el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
					<el-button size="mini" type="primary" @click="onResert">重置</el-button>
				</el-form-item>
			</el-form>
			<view class="content">
				<scroll-view class="menus" :scroll-into-view="menuScrollIntoView" scroll-with-animation scroll-y>
					<view class="wrapper">
						<view
							class="menu"
							:id="`menu-${item.id}`"
							:class="{ current: item.id === currentCateId }"
							v-for="(item, index) in goods"
							:key="index"
							@tap="handleMenuTap(item)"
						>
							<text>{{ item.name }}</text>
							<!-- <view class="dot" v-show="menuCartNum(item.id)">{{ menuCartNum(item.id) }}</view> -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list begin -->
				<scroll-view class="goods" scroll-with-animation scroll-y :scroll-top="cateScrollTop" @scroll="handleGoodsScroll">
					<view class="wrapper">
						<view class="list">
							<!-- category begin -->
							<div class="category" ref="category" v-for="(item, index) in goods" :key="index" :id="`cate-${item.id}`">
								<view class="title">
									<text>{{ item.name }}</text>
								</view>
								<view class="items">
									<!-- 商品 begin -->
									<el-card style="width:95%;margin-bottom:5px;" v-for="(good, key) in item.goods_list" :key="key">
										<goodItem :good="good" @changeAttr="changeAttr" @change="changeNum"></goodItem>
									</el-card>
									<!-- 商品 end -->
								</view>
							</div>
							<!-- category end -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list end -->
			</view>
			<span slot="footer" class="dialog-footer">
				<div style="position: absolute;left:30px;cursor: pointer;" @click="ShowgoodsAttrfalg">
					<el-avatar size="medium" :src="shopCar"></el-avatar>
					<span
						style="font-size:12px;;position: absolute;left:25px;top:-5px;color:#e4393c;width:20px;height:20px;line-height:20px;border-radius: 10px;text-align: center;background-color: #e4393c;color:#fff;"
					>
						{{ shopGoodsNum }}
					</span>
				</div>
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="购物车" append-to-body :visible.sync="goodsAttrfalg" width="30%">
			<div>
				<el-card style="margin-bottom:5px;" v-for="(item, key) in shopGoods" :key="key">
					<el-row :gutter="20">
						<el-col :span="6" style="text-align: center;">
							{{ item.goodsName }}
							<span v-if="item.goodsAttrValue">（{{ item.goodsAttrValue }}）</span>
						</el-col>
						<el-col :span="6" style="text-align: center;">
							<span style="color:#e4393c;font-weight: bold;">{{ item.goodsPrice }}元</span>
						</el-col>
						<el-col :span="6" style="text-align: center;">
							<el-input-number style="width:100px;" size="mini" @change="changeNumCar(item)" v-model="item.num" controls-position="right" :min="0"></el-input-number>
						</el-col>
						<el-col :span="6" style="text-align: center;">
							<span style="color:#e4393c;font-weight: bold;">{{ $NP.times(item.goodsPrice, item.num)}}元</span>
						</el-col>
					</el-row>
				</el-card>
			</div>
			<span slot="footer" class="dialog-footer"><el-button @click="goodsAttrfalg = false" type="primary">确 定</el-button></span>
		</el-dialog>
	</view>
</template>

<script>
import { select } from '@/api/goods/goods.js';
import { select as goodsTypeSelect } from '@/api/goods/goods_type.js';
import shopCar from '@/static/shopCar.png';
import goodItem from './goodItem.vue';
export default {
	components: {
		goodItem
	},
	props: {
		goodsList: {
			type: Object
		}
	},
	data() {
		return {
			shopCar,
			goodsForm: {
				goodsName: ''
			},
			dialogVisible: false,
			goodsAttrfalg: false,
			loading: false,
			goods: [],
			menuScrollIntoView: '',
			currentCateId: '',
			cateScrollTop: 0,
			shopGoods: {},
			shopGoodsNum: 0,
			goodsIds: {}
		};
	},
	watch: {
		shopGoods: {
			handler: function() {
				var _this = this;
				var num = 0;
				Object.keys(_this.shopGoods).forEach(key => {
					var item = _this.shopGoods[key];
					num += parseFloat(item.num);
				});
				this.shopGoodsNum = num;
			},
			deep: true
		}
	},
	methods: {
		show() {
			this.shopGoods = this.goodsList || {};
			this.dialogVisible = true;
			this.getAllgoods();
		},
		hide() {
			this.dialogVisible = false;
		},
		ShowgoodsAttrfalg() {
			if (this.shopGoodsNum) {
				this.goodsAttrfalg = true;
			} else {
				this.$message.warning('未点菜！');
			}
		},
		submit() {
			this.$emit('submit', this.shopGoods);
		},
		onSubmit() {
			this.getAllgoods();
		},
		onResert() {
			this.goodsForm = {
				goodsName: ''
			};
			this.getAllgoods();
		},
		changeNumCar(item) {
			var _this = this;
			if (item.goodsAttr && item.goodsAttr.length) {
				var allNum = 0;
				item.goodsAttr.forEach(attr => {
					var id = `${item._id}-${attr}`;
					allNum += parseFloat(_this.shopGoods[id] ? _this.shopGoods[id].num || 0 : 0);
				});
				var id = `${item._id}-${item.goodsAttr.join('')}`;
				var arr = this.goodsIds[id] || [];
				arr.forEach(child => {
					child.num = allNum;
				});
			} else {
				var id = `${item._id}-${item.goodsAttr.join('')}`;
				var arr = this.goodsIds[id] || [];
				arr.forEach(child => {
					child.num = item.num;
				});
			}
			if (!item.num) {
				var id = `${item._id}-${item.goodsAttr.join('')}`;
				if (item.goodsAttrValue) {
					id = `${item._id}-${item.goodsAttrValue}`;
				}
				delete this.shopGoods[id];
			}
		},
		changeAttr(item, attrValue) {
			var item = JSON.parse(JSON.stringify(item));
			var id = `${item._id}-${attrValue}`;
			if (this.goodsIds[id] && this.goodsIds[id].length) {
				this.goodsIds[id].forEach(good => {
					if (good.num != item.num) {
						good.num = item.num;
					}
				});
			}
			var shopGoods = JSON.parse(JSON.stringify(this.shopGoods));
			if (shopGoods[id]) {
				shopGoods[id].num++;
			} else {
				item.goodsAttrValue = attrValue;
				item.num = 1;
				shopGoods[id] = item;
			}
			this.shopGoods = shopGoods;
		},
		changeNum(item) {
			var item = JSON.parse(JSON.stringify(item));
			var id = `${item._id}-${item.goodsAttr.join('')}`;
			if (this.goodsIds[id] && this.goodsIds[id].length) {
				this.goodsIds[id].forEach(good => {
					if (good.num != item.num) {
						good.num = item.num;
					}
				});
			}
			var shopGoods = JSON.parse(JSON.stringify(this.shopGoods));
			if (item.num) {
				shopGoods[id] = item;
			} else {
				delete shopGoods[id];
			}
			this.shopGoods = shopGoods;
		},
		tongBuNum() {
			var goodsIds = {};
			if (this.goods && this.goods.length) {
				this.goods.forEach(item => {
					if (item.goods_list && item.goods_list.length) {
						item.goods_list.forEach(child => {
							var id = `${child._id}-${child.goodsAttr.join('')}`;
							goodsIds[id] = goodsIds[id] || [];
							goodsIds[id].push(child);
						});
					}
				});
			}
			this.goodsIds = goodsIds;
		},
		handleMenuTap(item) {
			this.cateScrollTop = item.top + 10;
			setTimeout(() => {
				this.currentCateId = item.id;
			}, 300);
		},
		handleGoodsScroll(event) {
			var { scrollTop } = event.detail;
			var goods = this.goods;
			for (var i = 0; i < goods.length; i++) {
				var item = goods[i];
				if (scrollTop >= item.top && scrollTop <= item.bottom) {
					this.currentCateId = item.id;
					return;
				}
			}
		},
		showGoodDetailModal() {},
		getAllgoods() {
			var _this = this;
			var params = {
				tenantId: this.$store.state.app.activeTenant
			};
			this.loading = true;
			goodsTypeSelect(params)
				.then(resType => {
					var typeClass = {};
					var goods = [];
					if (resType && resType.length) {
						resType.forEach((item, idx) => {
							typeClass[item._id] = idx;
							goods.push({
								goods_list: [],
								id: item._id,
								name: item.name
							});
						});
					}
					this.currentCateId = goods[0].id;
					var newParams = Object.assign(params, this.goodsForm);
					newParams.status = 1;
					select(newParams)
						.then(res => {
							if (res && res.length) {
								res.forEach(item => {
									if (item.goodsType && item.goodsType.length) {
										item.goodsType.forEach(type => {
											if (item.goodsAttr && item.goodsAttr.length) {
												var allNum = 0;
												item.goodsAttr.forEach(attr => {
													var id = `${item._id}-${attr}`;
													if (_this.shopGoods[id] && _this.shopGoods[id].num) {
														allNum += parseFloat(_this.shopGoods[id].num || 0);
													}
												});
												item.num = allNum;
											} else {
												var id = `${item._id}-${item.goodsAttr.join('')}`;
												if (_this.shopGoods[id] && _this.shopGoods[id].num) {
													item.num = _this.shopGoods[id].num || 0;
												} else {
													item.num = item.num || 0;
												}
											}
											goods[typeClass[type]].goods_list.push(item);
										});
									}
								});
							}
							this.goods = goods;
							this.loading = false;
							this.$nextTick(() => {
								var goods = JSON.parse(JSON.stringify(this.goods));
								var category = this.$refs.category;
								category.forEach((dom, idx) => {
									goods[idx].top = dom.offsetTop;
									goods[idx].bottom = dom.offsetTop + dom.offsetHeight;
								});
								this.goods = goods;
								this.tongBuNum();
							});
						})
						.catch(() => {
							this.loading = false;
						});
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>

<style lang="scss">
.content {
	width: 100%;
	height: calc(100vh - 212rpx - 388rpx);
	display: flex;

	.menus {
		width: 200rpx;
		height: 100%;
		overflow: hidden;

		.wrapper {
			width: 100%;
			height: 100%;

			.menu {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				padding: 30rpx 20rpx;
				font-size: 26rpx;
				position: relative;
				cursor: pointer;
				&.current {
					background-color: #eee;
				}

				.dot {
					position: absolute;
					width: 34rpx;
					height: 34rpx;
					line-height: 34rpx;
					font-size: 22rpx;
					color: #ffffff;
					top: 16rpx;
					right: 10rpx;
					border-radius: 100%;
					text-align: center;
				}
			}
		}
	}

	.goods {
		flex: 1;
		height: 100%;
		overflow: hidden;
		background-color: #ffffff;

		.wrapper {
			width: 100%;
			height: 100%;
			padding: 0 20rpx;
			.ads {
				height: calc(300 / 550 * 510rpx);

				image {
					width: 100%;
					height: 100%;
					border-radius: 8rpx;
				}
			}

			.list {
				width: 100%;

				.category {
					width: 100%;

					.title {
						padding: 30rpx 0;
						display: flex;
						align-items: center;
						.icon {
							width: 38rpx;
							height: 38rpx;
							margin-left: 10rpx;
						}
					}
				}

				.items {
					display: flex;
					flex-direction: column;
					padding-bottom: -30rpx;
				}
			}
		}
	}
}
</style>
