<template>
	<view>
		<el-dialog title="点菜" :visible.sync="dialogVisible" width="60%" append-to-body>
			<avue-form ref="form" v-model="form" :option="option">
				
			</avue-form>
		</el-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dialogVisible: true,
				form: {},
				option: {
					height: 'auto',
					calcHeight: 80,
					searchShow: true,
					searchMenuSpan: 6,
					rowKey: '_id',
					tip: false,
					tree: true,
					border: true,
					index: true,
					selection: false,
					viewBtn: true,
					addBtn: true,
					menuWidth: 300,
					column: [
						{
							label: '订单编号',
							prop: 'order_number',
							search: true,
							width: 180,
							span: 12,
							addDisplay: false,
							editDisplay: false
						},
						{
							label: '下单类型',
							prop: 'order_type',
							span: 12,
							disabled: true,
							type: 'select',
							value: 2,
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
							prop: 'table',
							addDisplay: false,
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
							formslot: true,
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
						},
						{
							label: '创建时间',
							prop: 'create_date',
							addDisplay: false,
							editDisplay: false,
							width: 130,
							slot: true
						},
						{
							label: '最后一次操作时间',
							prop: 'update_date',
							addDisplay: false,
							editDisplay: false,
							width: 130,
							slot: true
						},
						{
							label: '最后一次操作人',
							prop: 'operator',
							addDisplay: false,
							editDisplay: false
						}
					]
				},
			};
		},
		methods:{
			show(){
				this.dialogVisible = true;
			},
			hide(){
				this.dialogVisible = false;
			}
		}
	}
</script>

<style lang="scss">

</style>
