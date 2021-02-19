<template>
	<view class="uni-container">
		<el-card class="box-card" v-loading="loading2">
			<div slot="header" class="clearfix">
				<span>小程序设置
				</span>
				<el-button :loading="loading" @click="submitForm('ruleForm')" style="float: right; " size="small" type="success">保存</el-button>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="appid" prop="appid">
					<el-input v-model="ruleForm.appid"></el-input>
				</el-form-item>
				<el-form-item label="secret" prop="secret">
					<el-input v-model="ruleForm.secret" ></el-input>
				</el-form-item>
			</el-form>
		</el-card>
	</view>
</template>

<script>
	import {
		getList,
		updateXiaoCHengXu
	} from "@/api/tenant/tenant.js"
	export default {

		data() {
			return {
				ruleForm: {
					appid: '',
					secret: ''
				},
				loading: false,
				loading2: false,
				rules: {
					appid: [{
						required: true,
						message: '请输入appid',
						trigger: 'blur'
					}],
					secret: [{
						required: true,
						message: '请输入secret',
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
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true;
						updateXiaoCHengXu(this.ruleForm).then(()=>{
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
