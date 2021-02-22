<template>
	<view class="uni-container">
		<el-card class="box-card" v-loading="loading2">
			<div slot="header" class="clearfix">
				<span>门店设置
				</span>
				<el-button :loading="loading" @click="submitForm('ruleForm')" style="float: right; " size="small" type="success">保存</el-button>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="LOGO" prop="logo">
					<div class="el-upload" @click="getgoodsImg('goodsSmallImg')">
						<img v-if="ruleForm.logo" :src="ruleForm.logo" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</div>
				</el-form-item>
			</el-form>
		</el-card>
		<selectFile ref="selectFile" @submit="getImg"></selectFile>
	</view>
</template>

<script>
	import {
		getList,
		updatePush
	} from "@/api/tenant/tenant.js"
	import selectFile from "@/components/selectFile/selectFile.vue"
	export default {
		components: {
			selectFile
		},
		data() {
			return {
				ruleForm: {
					path: '',
					appkey: ''
				},
				loading: false,
				loading2: false,
				rules: {
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
			getImg(item) {
				var ruleForm = JSON.parse(JSON.stringify(this.ruleForm))
				ruleForm.logo = item.path;
				this.ruleForm = ruleForm;
				this.$refs.selectFile.hide();
			},
			getgoodsImg(type) {
				this.imgType = type;
				this.$refs.selectFile.show();
			},
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
<style scoped>
	.el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
