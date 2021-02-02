<template>
	<view class="uni-container">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>推送设置（仅支持
					<a href="https://www.goeasy.io/" target="_blank">GoEasy</a>
					）
				</span>
				<el-button :loading="loading" @click="submitForm('ruleForm')" style="float: right; " size="small" type="success">保存</el-button>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="path" prop="path">
					<el-input v-model="ruleForm.path"></el-input>
				</el-form-item>
				<el-form-item label="appkey" prop="appkey">
					<el-input v-model="ruleForm.appkey"></el-input>
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
	export default {

		data() {
			return {
				ruleForm: {
					path: '',
					appkey: ''
				},
				loading: false,
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
			getList({
				_id: this.$store.state.app.activeTenant
			}).then((res)=>{
				if(res && res.length) {
					this.ruleForm = res[0]
				}
			})
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
