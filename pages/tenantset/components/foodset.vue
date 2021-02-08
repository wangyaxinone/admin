<template>
	<view class="uni-container" v-loading="loading2">
		<el-card class="box-card" style="margin-bottom:10px;" v-for="(item,idx) in deptList" :key="idx">
			<div slot="header" class="clearfix">
				<span>{{item.dept_name}}</span>
				<el-button :loading="loading" @click="submitForm('ruleForm')" style="float: right; " size="small" type="success">保存</el-button>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
				<el-form-item label="同时制作的数量" prop="path">
					<el-input v-model="ruleForm.path"></el-input>
				</el-form-item>
			</el-form>
		</el-card>
	</view>
</template>

<script>
	import {
		getList,
		updatePush
	} from "@/api/tenant/tenant.js"
	import {getDeptByUser} from "@/api/system/user.js"
	import {getList as getDeptList} from "@/api/system/dept.js"
	export default {

		data() {
			return {
				ruleForm: {
					path: '',
					appkey: ''
				},
				loading: false,
				loading2: false,
				deptList: [],
				rules: {
					path: [{
						required: true,
						message: '请输入path',
						trigger: 'blur'
					}],
					appkey: [{
						required: true,
						message: '请输入appkey',
						trigger: 'blur'
					}],
				}
			}
		},
		created() {
			this.loading2 = true;
			getList({
				_id: this.$store.state.app.activeTenant
			}).then((res)=>{
				if(res && res.length) {
					this.ruleForm = res[0]
				}
				this.loading2 = false;
			}).catch(()=>{
				this.loading2 = false;
			})
			if(this.$store.state.app.isTenantAdminOrAdmin){
				getDeptList({
					isCook: 1,
					tenantId: this.$store.state.app.activeTenant
				}).then((res)=>{
					this.deptList = res;
				})
			}else{
				getDeptByUser({
					userId: this.$store.state.user.userInfo._id
				}).then((res)=>{
					this.deptList = res;
				})
				
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						updatePush(this.ruleForm).then(()=>{
							this.$message({
							  message: '保存成功',
							  type: 'success'
							});
							this.loading = false;
						}).catch(()=>{
							this.loading = false;
						})
					} else {
						return false;
					}
				});
			},
		}
	}
</script>
<style>
</style>
