<template>
	<view class="uni-container" style="min-height:100px;" v-loading="loading2">
		<el-card class="box-card" style="margin-bottom:10px;" v-for="(item,idx) in deptList" :key="idx">
			<div slot="header" class="clearfix">
				<span>{{item.dept_name}}</span>
				<el-button :loading="loading" @click="submitForm(item)" style="float: right; " size="small" type="success">保存</el-button>
			</div>
			<el-form  ref="ruleForm" label-width="140px" class="demo-ruleForm">
				<el-form-item label="同时制作的数量" prop="foodNum">
					<el-input-number v-model="item.foodNum" controls-position="right" :min="1"></el-input-number>
				</el-form-item>
			</el-form>
		</el-card>
		<avue-empty  v-if="!deptList.length"></avue-empty>
	</view>
</template>

<script>
	import {
		update,
	} from "@/api/system/dept.js"
	import {getDeptByUser} from "@/api/system/user.js"
	import {getList as getDeptList} from "@/api/system/dept.js"
	export default {

		data() {
			return {
				loading: false,
				loading2: false,
				deptList: [],
			}
		},
		created() {
			this.loading2 = true;
			if(this.$store.state.app.isTenantAdminOrAdmin){
				getDeptList({
					isCook: 1,
					tenantId: this.$store.state.app.activeTenant
				}).then((res)=>{
					if(res && res.length) {
						res.forEach((item)=>{
							item.foodNum = item.foodNum || 1;
						})
					}
					this.deptList = res;
					this.loading2 = false;
				})
			}else{
				getDeptByUser({
					userId: this.$store.state.user.userInfo._id
				}).then((res)=>{
					if(res && res.length) {
						res.forEach((item)=>{
							item.foodNum = item.foodNum || 1;
						})
					}
					this.deptList = res;
					this.loading2 = false;
				})
				
			}
		},
		methods: {
			submitForm(item) {
				this.loading = true;
				update(item).then(()=>{
					this.$message({
					  message: '保存成功',
					  type: 'success'
					});
					this.loading = false;
				}).catch(()=>{
					this.loading = false;
				})
			},
		}
	}
</script>
<style>
</style>
