<template>
	<view>
		<el-dialog title="加菜" :visible.sync="dialogVisible" width="60%" append-to-body>
			<avue-form ref="form" v-model="form" :option="option">
				<template slot="menuForm">
					<el-button type="primary" @click="handleSubmit">提 交</el-button>
					<el-button @click="handleEmpty">取 消</el-button>
				</template>
			</avue-form>
		</el-dialog>
	</view>
</template>

<script>
	import { getDictByDictCode } from '@/api/system/dict.js';
	export default {
		data() {
			return {
				dialogVisible: false,
				form: {},
				option: {
					emptyBtn:false,
					submitBtn:false,
					column: [{
						label: "订单编号",
						prop: "order_number",
						disabled: true
					},{
						label: "餐桌",
						prop: "table",
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
						formslot:true,
						disabled: true
					}]
				}
			};
		},
		methods: {
			handleSubmit() {

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
