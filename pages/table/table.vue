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
				<el-button type="primary" size="small" @click="onSubmit">查询</el-button>
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
		<el-dialog
		  :title="title"
		  :visible.sync="dialogVisible"
		  width="30%"
		  >
		  
		</el-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '新增',
				dialogVisible: false,
				form: {
					name: '',
					tableType: ''
				},
				tableList: []
			};
		},
		methods: {
			addTable() {
				this.dialogVisible = true;
			},
			onSubmit() {
				
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
