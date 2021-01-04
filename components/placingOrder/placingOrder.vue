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
							label: '菜品数量',
							prop: 'number',
							formslot:true,
							span: 24
						},
						{
							label: '订单总价',
							prop: 'order_price',
							disabled: true
						},
						{
							label: '实付金额',
							prop: 'amound_price',
							disabled: false,
							type: 'number',
							precision: 2,
						},
						{
							label: '未付款金额',
							prop: 'no_order_price',
							hide: true,
							addDisplay: false,
							display: false,
							disabled: true
						},
						{
							label: '剩余实付金额',
							prop: 'no_amound_price',
							type: 'number',
							hide: true,
							display: false,
							addDisplay: false,
							precision: 2,
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
				if(this.form.goods_list) {
					Object.keys(this.form.goods_list).forEach((key)=>{
						var item = this.form.goods_list[key];
						var currentPrice =parseFloat(_this.$NP.times(item.goodsPrice, item.num));
						price = _this.$NP.plus(price, currentPrice);
					})
				}
				this.form.order_price = price;
			},
			handleSubmit() {
				var row = JSON.parse(JSON.stringify(this.form));
				row.tenantId = this.$store.state.app.activeTenant;
				var newList = [];
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
				add(row)
					.then(() => {
						this.loadData();
						this.$message({
							message: '新增成功',
							type: 'success'
						});
						done();
					})
					.catch(err => {
						done();
					});
			}
		}
	}
</script>

<style lang="scss">

</style>
