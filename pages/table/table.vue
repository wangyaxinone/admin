<template>
	<view class="table">
		<el-form :inline="true" :model="form" class="demo-form-inline">
			<el-form-item label="餐桌名称">
				<el-input v-model="form.name" size="small" placeholder="餐桌名称"></el-input>
			</el-form-item>
			<el-form-item label="餐桌分类">
				<el-select v-model="form.tableType" size="small" placeholder="餐桌分类">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onSearch">查询</el-button>
				<el-button @click="onResert" size="small">重置</el-button>
			</el-form-item>
		</el-form>
		<div style="margin-bottom: 15px;">
			<el-button-group>
				<el-button type="primary" size="small" @click="addTable">新增</el-button>
				<el-button type="danger" size="small">删除</el-button>
			</el-button-group>
		</div>
		<el-row :gutter="20">
			<el-col :span="4">
				<el-card class="box-card">

				</el-card>
			</el-col>
		</el-row>
		<el-dialog :title="title" :visible.sync="dialogVisible" width="60%">
			<avue-form ref="form" v-model="formData" :option="option" @reset-change="emptytChange" @submit="submit">
			</avue-form>
		</el-dialog>
	</view>
</template>

<script>
	import {
		getDictByDictCode
	} from "@/api/system/dict.js"
	import {
		select,
	} from "@/api/table/table_type.js"
	// import {
	// 	getList,
	// 	add,
	// 	update,
	// 	remove,
	// } from "@/api/table/table.js"
	export default {
		data() {
			return {
				title: '新增',
				dialogVisible: false,
				form: {
					name: '',
					tableType: ''
				},
				formData: {},
				option:{
					column: [{
						label: "餐桌名称",
						prop: "name",
						rules: [{
							required: true,
							message: "请输入餐桌名称",
							trigger: "blur",
						}, ],
					},{
						label: "餐桌分类",
						prop: "tableType",
						type: 'select',
						typeformat(item, label, value) {
							return `${item[label]} (${item.info} ${item.comment})`
						},
						props: {
							label: "name",
							value: "_id",
							disabled: "disabled"
						},
						dicData: [],
						rules: [{
							required: true,
							message: "请输入餐桌分类",
							trigger: "blur",
						}, ],
					},{
						label: "餐桌状态",
						prop: "status",
						type: 'select',
						value: 1,
						props: {
							label: "dict_name",
							value: "dict_key",
							disabled: "disabled"
						},
						dicData: [],
					},{
						label: "负责人",
						prop: "personLiable",
					},{
						label: "排序",
						prop: "sort",
						type: 'number'
					},{
						label: "备注",
						prop: "commit",
					}]
				},
				tableList: []
			};
		},
		mounted() {
			getDictByDictCode({
				dict_code: 'table_status'
			}).then((res) => {
				const column = this.findObject(this.option.column, "status");
				column.dicData = res;
			})
			select().then((res)=>{
				const column = this.findObject(this.option.column, "tableType");
				column.dicData = res;
			})
		},
		methods: {
			addTable() {
				this.dialogVisible = true;
			},
			submit(){},
			emptytChange(){},
			onSearch() {

			},
			onResert() {
				this.form = {
					name: '',
					tableType: ''
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
	.table {
		padding: 15px;
	}
</style>
