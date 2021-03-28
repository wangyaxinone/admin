<template>
	<view>
		<el-dialog title="点菜" :visible.sync="dialogVisible" width="60%" append-to-body>
			<avue-form ref="form" v-model="form" :option="option" @reset-change="resetChange">
				<template slot="menuForm">
					<el-button type="primary" :loading="loading" @click="handleSubmit">提 交</el-button>
					<el-button @click="hide" :loading="loading">取 消</el-button>
				</template>
				<template slot-scope="scope" slot="number">
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
						<div v-if="form.allPackingPrice" style="text-align: right;padding:0 20px;">
							包装费：<span style="color:#e4393c;font-weight: bold;">{{form.allPackingPrice}}元</span>
						</div>
						<div v-if="form.utensilsPrice" style="text-align: right;padding:0 20px;">
							餐具费：<span style="color:#e4393c;font-weight: bold;">{{form.utensilsPrice}}元</span>
						</div>
					</div>
				</template>
			</avue-form>
		</el-dialog>
		<selectGoods ref="selectGoods" :goodsList="form.goods_list || {}" @submit="submit"></selectGoods>
	</view>
</template>

<script>
	import { getDictByDictCode } from '@/api/system/dict.js';
	import selectGoods from '@/components/selectGoods/selectGoods.vue';
	import { add } from '@/api/order/order.js';
	export default {
		components:{
			selectGoods
		},
		data() {
			return {
				dialogVisible: false,
				loading: false,
				form: {
					goods_list: {}
				},
				option: {
					emptyBtn:false,
					submitBtn:false,
					column: [
						{
							label: '下单类型',
							prop: 'order_type',
							span: 12,
							disabled: true,
							type: 'select',
							value: 1,
							dicData: [],
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
							rules: [
								{
									required: false,
									message: '请选择下单类型',
									trigger: 'change'
								}
							]
						},
						{
							label: '餐桌',
							prop: 'tableName',
							disabled: true
						},
						
						{
							label: '菜品数量',
							prop: 'number',
							formslot:true,
							span: 24
						},
						{
							label: '就餐人数',
							prop: 'eatPeople',
							type: 'number',
							minRows: 1,
							value: 1
						},
						{
							label: '订单总价',
							prop: 'order_price',
							minRows: 0,
							disabled: true
						},
						{
							label: '实付金额',
							prop: 'amound_price',
							disabled: false,
							minRows: 0,
							type: 'number',
							precision: 2,
						},
						{
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
						},
						{
							label: '备注',
							prop: 'comment',
							span: 12,
							width: 150,
							rules: [
								{
									required: false,
									message: '请输入备注',
									trigger: 'change'
								}
							]
						}
					]
				},
			};
		},
		created() {
			getDictByDictCode({
				dict_code: 'order_status'
			}).then((res) => {
				const column = this.findObject(this.option.column, "status");
				column.dicData = res;
			})
			getDictByDictCode({
				dict_code: 'order_status'
			}).then((res) => {
				var dishesZhiFuMap = {};
				res.forEach((item)=>{
					dishesZhiFuMap[item.dict_key] = item.dict_name;
				})
				this.dishesZhiFuMap = dishesZhiFuMap;
			})
			getDictByDictCode({
				dict_code: 'dishes_status'
			}).then((res) => {
				var dishesZhiZuoMap = {};
				res.forEach((item)=>{
					dishesZhiZuoMap[item.dict_key] = item.dict_name;
				})
				this.dishesZhiZuoMap = dishesZhiZuoMap;
			})
			getDictByDictCode({
				dict_code: 'order_type'
			}).then((res) => {
				const column = this.findObject(this.option.column, "order_type");
				column.dicData = res;
			})
		},
		watch: {
			'form.eatPeople': function(newValue, oldValue){
				this.get_order_price();
			}
		},
		methods:{
			show(data){
				this.form.table = data.table;
				this.form.tableName = data.tableName;
				this.dialogVisible = true;
			},
			hide(){
				this.dialogVisible = false;
			},
			selectGoods() {
				this.$refs.selectGoods.show();
			},
			submit(obj) {
				var form = JSON.parse(JSON.stringify(this.form))
				form.goods_list = obj;
				this.form = form;
				this.get_order_price();
				this.$refs.selectGoods.hide();
			},
			changeNumCar(item) {
				if(!item.num) {
					var id = `${item._id}-${item.goodsAttr.join('')}`;
					if(item.goodsAttrValue) {
						id = `${item._id}-${item.goodsAttrValue}`;
					}
					delete this.form.goods_list[id];
				}
				this.get_order_price();
			},
			get_order_price() {
				var price = 0;
				var _this = this;
				var packingPriceEveryMap = {};
				var allPackingPrice = 0;
				var utensilsPrice = 0;
				if (_this.form.goods_list) {
					Object.keys(_this.form.goods_list).forEach((key, idx) => {
						var item = _this.form.goods_list[key];
						var currentPrice = parseFloat(_this.$NP.times(item.goodsPrice, item.num));
						if(_this.form.order_type == 2) {
							if(item.packingPriceEvery) {
								allPackingPrice = _this.$NP.plus(allPackingPrice, _this.$NP.times(item.packingPrice, item.num));
							}else{
								if(!packingPriceEveryMap[item._id]) {
									allPackingPrice = _this.$NP.plus(allPackingPrice, item.packingPrice);
									packingPriceEveryMap[item._id] = true;
								}
							}
							
						}
						price = _this.$NP.plus(price, currentPrice);
					})
				}
				if(_this.form.order_type == 1) {
					utensilsPrice = _this.$NP.plus(utensilsPrice, _this.$NP.times(_this.$store.state.app.activeTenantInfo.utensils || 0, _this.form.eatPeople));
				}
				price = _this.$NP.plus(price, allPackingPrice,utensilsPrice);
				_this.form.allPackingPrice = allPackingPrice;
				_this.form.utensilsPrice = utensilsPrice;
				_this.form.order_price = price;
			},
			handleSubmit() {
				var row = JSON.parse(JSON.stringify(this.form));
				row.tenantId = this.$store.state.app.activeTenant;
				var newList = [];
				this.loading = true;
				if(row.goods_list) {
					Object.keys(row.goods_list).forEach((key)=>{
						var item = row.goods_list[key];
						if(item.num>0) {
							newList.push({
								goodId: item._id,
								goodsName: item.goodsName,
								num: item.num,
								goodsAttrValue: item.goodsAttrValue,
								comment: row.comment,
								order_type: row.order_type
							})
						}
						
					})	
				}
				row.goods_list = newList;
				row.utensils = this.$store.state.app.activeTenantInfo.utensils || 0;
				add(row)
					.then(() => {
						this.$message({
							message: '新增成功',
							type: 'success'
						});
						this.hide();
						this.$emit('submit')
						this.loading = false;
					})
					.catch(err => {
						this.loading = false;
					});
			}
		}
	}
</script>

<style lang="scss">

</style>
