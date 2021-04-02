<template>
	<view>
		<el-dialog title="临时添加菜品" :visible.sync="dialogVisible" width="60%">
			<avue-form ref="form" v-model="form" :option="option" @reset-change="emptytChange" @submit="submit">
				<template slot-scope="scope" slot="goodsName">
					<div>
						<el-button @click="selectGoods">点菜</el-button>
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
		<selectGoods ref="selectGoods" :goodsList="form.goods_list || {}" @submit="selectGoodsSubmit"></selectGoods>
	</view>
</template>

<script>
	import selectGoods from '@/components/selectGoods/selectGoods.vue';
	export default {
		components:{
			selectGoods
		},
		name: "addDishes",
		data() {
			return {
				dialogVisible: false,
				form: {},
				option: {
					column: [{
							label: '菜品名称',
							prop: 'goodsName',
							width: 120,
							formslot:true,
							span: 24,
						},
						{
							label: '备注',
							prop: 'order_comment',
							span: 12,
							width: 150,
							rules: [{
								required: false,
								message: '请输入备注',
								trigger: 'change'
							}]
						},
						{
							label: '餐桌',
							prop: 'tableName',
						},
						{
							label: '下单类型',
							prop: 'order_type',
							span: 12,
							addDisabled: true,
							type: 'select',
							value: 1,
							dicData: this.$store.state.app.dicts.order_type,
							rules: [{
								required: false,
								message: '请选择下单类型',
								trigger: 'change'
							}]
						},
						
					]
				}
			};
		},
		watch: {
			'$store.state.app.dicts': function() {
				const order_type = this.findObject(this.option.column, "order_type");
				order_type.dicData = this.$store.state.app.dicts.order_type;
			},
		},
		methods: {
			selectGoods() {
				this.$refs.selectGoods.show();
			},
			show() {
				this.dialogVisible = true;
			},
			hide() {
				this.dialogVisible = false;
			},
			emptytChange() {
				this.dialogVisible = false;
			},
			submit(form,done,loading) {
				this.$emit('submit', {
					form,done,loading
				})
			},
			selectGoodsSubmit(obj) {
				var form = JSON.parse(JSON.stringify(this.form))
				form.goods_list = obj;
				this.form = form;
				this.$refs.selectGoods.hide();
			},
		}
	}
</script>

<style lang="scss">

</style>
