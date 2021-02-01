<template>
	<view class="uni-container">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>推送设置（仅支持
					<a href="https://www.goeasy.io/" target="_blank">GoEasy</a>
					）
				</span>
				<el-button @click="submitForm('ruleForm')" style="float: right; " size="small" type="success">保存</el-button>
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
	export default {

		data() {
			return {
				ruleForm: {
					path: '',
					appkey: ''
				},
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

		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
		}
	}
</script>
<style>
</style>
