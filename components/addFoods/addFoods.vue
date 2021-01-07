<template>
	<view>
		<el-dialog title="加菜" :visible.sync="dialogVisible" width="60%" append-to-body>
			<avue-form ref="form" v-model="form" :option="option">
				<template slot="menuForm">
					<el-button type="primary" :loading="loading" @click="handleSubmit">提 交</el-button>
					<el-button @click="hide" :loading="loading">取 消</el-button>
				</template>
				<template slot="number">
					<div>
						<el-button type="primary" @click="selectGoods">点菜</el-button>
						<el-card style="margin-top:5px;" v-for="(item,key) in form.goods_list" :key="key">
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
				</template>
			</avue-form>
			<selectGoods ref="selectGoods" :goodsList="form.goods_list || {}" @submit="submit"></selectGoods>
		</el-dialog>
	</view>
</template>

<script>
	import { getDictByDictCode } from '@/api/system/dict.js';
	import selectGoods from '@/components/selectGoods/selectGoods.vue';
	export default {
		components:{selectGoods},
		data() {
			return {
				loading: false,
				dialogVisible: false,
				form: {
					goods_list:{}
				},
				option: {
					emptyBtn:false,
					submitBtn:false,
					column: [{
						label: "订单编号",
						prop: "order_number",
						disabled: true
					},{
						label: "餐桌",
						prop: "tableName",
						disabled: true
					},{
						label: '订单状态',
						prop: 'status',
						type: 'select',
						disabled: true,
						value: 1,
						dicData: [],
						props: {
							label: 'dict_name',
							value: 'dict_key'
						},
					},{
						label: "加菜",
						prop: "number",
						span: 24,
						formslot:true,
						disabled: true
					}]
				}
			};
		},
		methods: {
			submit(obj) {
				var form = JSON.parse(JSON.stringify(this.form))
				form.goods_list = obj;
				this.form = form;
				this.$refs.selectGoods.hide();
			},
			get_order_price() {
				var price = 0;
				var _this = this;
				if(this.form.goods_list) {
					Object.keys(this.form.goods_list).forEach((key)=>{
						var item = this.form.goods_list[key];
						var currentPrice =parseFloat(_this.$NP.times(item.goodsPrice, item.num));
						price = _this.$NP.plus(price, currentPrice);
					})
				}
				this.form.order_price = price;
			},
			changeNumCar(item) {
				if(!item.num) {
					var id = `${item._id}-${item.goodsAttr.join('')}`;
					if(item.goodsAttrValue) {
						id = `${item._id}-${item.goodsAttrValue}`;
					}
					delete this.form.goods_list[id];
				}
				// this.get_order_price();
				this.$refs.selectGoods.hide();
			},
			selectGoods() {
				this.$refs.selectGoods.show();
			},
			handleSubmit() {
				var newList = [];
				if(this.form.goods_list) {
					Object.keys(this.form.goods_list).forEach((key)=>{
						var item = this.form.goods_list[key];
						if(item.num>0) {
							newList.push({
								goodId: item._id,
								goodsName: item.goodsName,
								num: item.num,
								goodsAttrValue: item.goodsAttrValue,
								comment: this.form.comment,
							})
						}
						
					})	
				}
				var data = {
					...this.form,
					goods_list: newList
				}
				this.$emit('submit',data)
			},
			handleEmpty() {
			
			},
			show(row) {
				this.form = JSON.parse(JSON.stringify(row));
				this.dialogVisible = true;
				getDictByDictCode({
					dict_code: 'order_status'
				}).then((res) => {
					const column = this.findObject(this.option.column, "status");
					column.dicData = res;
				})
			},
			hide() {
				this.dialogVisible = false;
			}
		}
	}
</script>

<style lang="scss">

</style>
