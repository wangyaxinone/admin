<template>
	<view class="good">
		<image mode="aspectFill" :src="good.goodsSmallImg" class="image"></image>
		<view class="right">
			<text class="name">
				菜品名称：
				<text style="font-weight:bold;">【{{ good.goodsName }}】</text>
			</text>
			<text class="name">
				菜品单价：
				<text style="font-weight:bold;color: #e4393c;">{{ good.goodsPrice }}元</text>
			</text>
			<text class="name">
				库存数量：
				<text>{{ good.stockNumber }}</text>
			</text>
			<view class="tips" v-if="good.goodsAttr && good.goodsAttr.length">
				<el-tag style="margin-right:10px" v-for="(item, idx) in good.goodsAttr" :key="idx">{{ item }}</el-tag>
			</view>
		</view>
		<view style="width:160px;"><el-input-number style="width:100px;" @change="changeNum" v-model="good.num" controls-position="right" :min="0" :max="good.stockNumber"></el-input-number></view>
		<el-dialog title="规格" append-to-body :visible.sync="goodsAttrfalg" width="30%">
			<el-radio-group v-model="goodAttrValue">
			          <el-radio-button :label="item" v-for="(item,idx) in good.goodsAttr" :key="idx"></el-radio-button>
			</el-radio-group>
			<span slot="footer" class="dialog-footer">
				<el-button @click="goodsAttrfalg = false">取 消</el-button>
				<el-button type="primary" @click="submiGoodAttr">确 定</el-button>
			</span>
		</el-dialog>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsAttrfalg: false,
			goodAttrValue: ''
		};
	},
	props: {
		good: {
			type: Object
		}
	},
	methods: {
		changeNum(currentValue, oldValue) {
			this.good.goodsAttr = this.good.goodsAttr || '';
			if (this.good.goodsAttr && this.good.goodsAttr.length) {
				this.$nextTick(() => {
					this.good.num = oldValue;
				});
				if (currentValue < oldValue) {
					this.$message.warning('当前菜品有规格，只能在购物车减少');
					return;
				} else {
					this.goodsAttrfalg = true;
					this.goodAttrValue = '';
				}
			} else {
				this.$emit('change', this.good);
			}
		},
		submiGoodAttr() {
			if(!this.goodAttrValue) {
				this.$message.warning('规格必选！');
				return;
			}
			this.good.num++;
			this.$emit('changeAttr', this.good, this.goodAttrValue);
			this.goodsAttrfalg = false;
		},
	}
};
</script>

<style lang="scss" scoped>
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
</style>
