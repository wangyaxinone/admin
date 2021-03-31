<template>
	<view>
		<el-dialog title="临时添加菜品" :visible.sync="dialogVisible" width="60%">
			<avue-form ref="form" v-model="form" :option="option" @reset-change="emptytChange" @submit="submit">
				<template slot-scope="scope" slot="goodsName">
					<el-button @click="selectGoods">点菜</el-button>
				</template>
			</avue-form>
		</el-dialog>
	</view>
</template>

<script>
	export default {
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
							span: 12,
						},
						{
							label: '菜品属性',
							prop: 'goodsAttrValue',
							span: 12,
							addDisplay: false,
							editDisplay: false
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
							label: '下单类型',
							prop: 'order_type',
							span: 12,
							addDisabled: true,
							type: 'select',
							value: 2,
							dicData: [],
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
							rules: [{
								required: false,
								message: '请选择下单类型',
								trigger: 'change'
							}]
						},
						{
							label: '餐桌',
							prop: 'tableName',
							formslot: true,
							display: false,
							addDisplay: false,
							addDisabled: true,
						},
						{
							label: '菜品状态',
							prop: 'status',
							type: 'select',
							disabled: true,
							fixed: true,
							slot: true,
							value: 1,
							dicData: [],
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
						},
						{
							label: '订单状态',
							prop: 'order_status',
							type: 'select',
							value: 1,
							dicData: [],
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
						},
					]
				}
			};
		},
		methods: {
			selectGoods() {},
			show() {
				this.dialogVisible = true;
			},
			emptytChange() {
				this.dialogVisible = false;
			},
			submit() {},
		}
	}
</script>

<style lang="scss">

</style>
