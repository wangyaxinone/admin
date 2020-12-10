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
									<el-card style="width:95%;" v-for="(good, key) in item.goods_list" :key="key">
										<view class="good">
											<image mode="aspectFill" :src="good.goodsSmallImg" class="image" @tap="showGoodDetailModal(item, good)"></image>
											<view class="right">
												<text class="name">
													菜品名称：
													<text style="font-weight:bold;">【{{ good.goodsName }}】</text>
												</text>
												<text class="name">
													菜品单价：
													<text style="font-weight:bold;color: #e4393c;">{{ good.goodsPrice }}元</text>
												</text>
												<view class="tips" v-if="good.goodsAttr && good.goodsAttr.length">
													<el-tag style="margin-right:10px" v-for="(item, idx) in good.goodsAttr" :key="idx">{{ item }}</el-tag>
												</view>
											</view>
											<view style="width:160px;">
												<el-input-number
													style="width:100px;"
													@change="changeNum(good)"
													v-model="good.num"
													controls-position="right"
													:min="0"
												></el-input-number>
											</view>
										</view>
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
				<div style="position: absolute;left:30px;cursor: pointer;">
					<el-avatar size="medium" :src="shopCar"></el-avatar>
					<span  style="font-size:12px;;position: absolute;left:25px;top:-5px;color:#e4393c;width:20px;height:20px;line-height:20px;border-radius: 10px;text-align: center;background-color: #e4393c;color:#fff;">
						{{shopGoodsNum}}
					</span>
				</div>
				<el-button @click="goodsAttrfalg = false">取 消</el-button>
				<el-button type="primary" @click="goodsAttrfalg = false">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="提示" :visible.sync="goodsAttrfalg" width="30%">
			<span>这是一段信息</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="goodsAttrfalg = false">取 消</el-button>
				<el-button type="primary" @click="goodsAttrfalg = false">确 定</el-button>
			</span>
		</el-dialog>
	</view>
</template>

<script>
import { select } from '@/api/goods/goods.js';
import { select as goodsTypeSelect } from '@/api/goods/goods_type.js';
import shopCar from "@/static/shopCar.png"
export default {
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
			shopGoodsNum: 0
		};
	},
	watch:{
		shopGoods: {
			handler: function() {
				debugger
				var _this = this;
				var num = 0;
				Object.keys(_this.shopGoods).forEach((key)=>{
					var item = _this.shopGoods[key];
					num += parseFloat(item.num);
				})
				this.shopGoodsNum = num;
			},
			deep: true,
		}
	},
	methods: {
		show() {
			this.dialogVisible = true;
			this.getAllgoods();
		},
		hide() {
			this.dialogVisible = false;
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
		changeNum(item) {
			if (item.goodsAttr && item.goodsAttr.length) {
				this.goodsAttrfalg = true;
			}else{
				var id = `${item._id}-${item.goodsAttr.join('')}`;
				var shopGoods = JSON.parse(JSON.stringify(this.shopGoods));
				if(item.num) {
					shopGoods[id] = item;
					
				}else{
					delete shopGoods[id];
				}
				this.shopGoods = shopGoods;
				
			}
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
					select(newParams)
						.then(res => {
							if (res && res.length) {
								res.forEach(item => {
									if (item.goodsType && item.goodsType.length) {
										item.goodsType.forEach(type => {
											item.num = item.num || 0;
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

					.good {
						display: flex;
						align-items: center;
						margin-bottom: 30rpx;

						.image {
							width: 120rpx;
							height: 120rpx;
							margin-right: 20rpx;
							border-radius: 8rpx;
						}

						.right {
							flex: 1;
							overflow: hidden;
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							justify-content: flex-start;
							padding-right: 14rpx;

							.name {
								margin-bottom: 10rpx;
							}

							.tips {
								width: 100%;
								line-height: 40rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								margin-bottom: 10rpx;
							}

							.price_and_action {
								width: 100%;
								display: flex;
								justify-content: space-between;
								align-items: center;

								.price {
									font-weight: 600;
								}

								.btn-group {
									display: flex;
									justify-content: space-between;
									align-items: center;
									position: relative;

									.btn {
										padding: 0 20rpx;
										box-sizing: border-box;
										height: 44rpx;
										line-height: 44rpx;

										&.property_btn {
											border-radius: 24rpx;
										}

										&.add_btn,
										&.reduce_btn {
											padding: 0;
											width: 44rpx;
											border-radius: 44rpx;
										}
									}

									.dot {
										position: absolute;
										background-color: #ffffff;
										width: 36rpx;
										height: 36rpx;
										line-height: 36rpx;
										text-align: center;
										border-radius: 100%;
										right: -12rpx;
										top: -10rpx;
									}

									.number {
										width: 44rpx;
										height: 44rpx;
										line-height: 44rpx;
										text-align: center;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>
