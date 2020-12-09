<template>
	<view>
		<el-dialog v-loading="loading" title="点菜" append-to-body :visible.sync="dialogVisible" width="60%">
			<view class="content">
				<scroll-view class="menus" :scroll-into-view="menuScrollIntoView" scroll-with-animation scroll-y>
					<view class="wrapper">
						<view
							class="menu"
							:id="`menu-${item.id}`"
							:class="{ current: item.id === currentCateId }"
							v-for="(item, index) in goods"
							:key="index"
							@tap="handleMenuTap(item.id)"
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
							<view class="category" v-for="(item, index) in goods" :key="index" :id="`cate-${item.id}`">
								<view class="title">
									<text>{{ item.name }}</text>
								</view>
								<view class="items">
									<!-- 商品 begin -->
									<view class="good" v-for="(good, key) in item.goods_list" :key="key">
										<image :src="good.goodsSmallImg" class="image" @tap="showGoodDetailModal(item, good)"></image>
										<view class="right">
											<text class="name">{{ good.goodsName }}</text>
											<text class="tips">{{ good.content }}</text>
										</view>
									</view>
									<!-- 商品 end -->
								</view>
							</view>
							<!-- category end -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list end -->
			</view>
		</el-dialog>
	</view>
</template>

<script>
import { select } from '@/api/goods/goods.js';
import { select as goodsTypeSelect } from '@/api/goods/goods_type.js';
export default {
	data() {
		return {
			dialogVisible: false,
			loading: false,
			goods: [],
			menuScrollIntoView: '',
			currentCateId: '',
			cateScrollTop: 0,
		};
	},
	methods: {
		show() {
			this.dialogVisible = true;
			this.getAllgoods();
		},
		hide() {
			this.dialogVisible = false;
		},
		handleMenuTap() {},
		handleGoodsScroll() {},
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
					select(params)
						.then(res => {
							if (res && res.length) {
								res.forEach(item => {
									if (item.goodsType && item.goodsType.length) {
										item.goodsType.forEach(type => {
											goods[typeClass[type]].goods_list.push(item);
										});
									}
								});
							}
							this.goods = goods;
							this.loading = false;
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
	height: calc(100vh - 212rpx);
	/* #ifdef H5 */
	height: calc(100vh - 212rpx - 188rpx);
	/* #endif */
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

				&.current {
					background-color: #ffffff;
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
			padding: 20rpx;

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
							width: 160rpx;
							height: 160rpx;
							margin-right: 20rpx;
							border-radius: 8rpx;
						}

						.right {
							flex: 1;
							height: 160rpx;
							overflow: hidden;
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							justify-content: space-between;
							padding-right: 14rpx;

							.name {
								margin-bottom: 10rpx;
							}

							.tips {
								width: 100%;
								height: 40rpx;
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
