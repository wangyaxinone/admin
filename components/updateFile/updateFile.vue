<template>
	<el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :title="title" :visible.sync="dialogVisible" width="40%" append-to-body style="text-align:center;">
		<div class="el-upload" @click="upload">
			<i class="el-icon-plus avatar-uploader-icon"></i>
		</div>
		<el-row type="flex" style="margin-bottom:10px;" justify="center" :gutter="20" v-for="(item,idx) in fileList" :key="idx">
			<el-col :span="3">
				<el-image style="height: 30px" :src="item.path" fit="fill "></el-image>
			</el-col>
			<el-col :span="11">
				<el-input size="mini" placeholder="请输入内容" suffix-icon="el-icon-date" v-model="fileNameList[idx].name">
				</el-input>
			</el-col>
			<el-col :span="2">
				<el-button @click="delFile(item,idx)" size="mini" type="danger" icon="el-icon-delete" circle></el-button>
			</el-col>
			<el-col :span="4">
				{{fileNameList[idx].progress}}%
			</el-col>
		</el-row>
		<div style="text-align:center;margin-top:20px;">
			<el-button :loading="loading" @click="submit" size="medium" type="primary">确定</el-button>
			<el-button :loading="loading" size="medium" @click="hide">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				loading:false,
				dialogVisible: false,
				title: "上传文件",
				data: {
					tenantId: '',
					path: '',
				},
				fileList: [],
				fileNameList: []
			};
		},
		props: {
			path: {
				type: String
			}
		},
		watch: {
			path: {
				handler() {
					this.data.path = this.path;
				},
				deep: true,
				immediate: true
			},
			tenantId() {
				this.data.tenantId = this.tenantId;
			}
		},
		methods: {
			delFile(item, idx) {
				this.fileList.splice(idx, 1)
			},
			submit() {
				var num = 0;
				var _this = this;
				_this.loading = true;
				var data = [];
				this.fileList.forEach((item,idx)=>{
					uniCloud.uploadFile({
						filePath: item.path,
						cloudPath: `${this.path?this.path+'/':''}${_this.fileNameList[idx].name}.${_this.fileNameList[idx].suffix}`,
						onUploadProgress: function(progressEvent) {
							var percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							var fileNameList = JSON.parse(JSON.stringify(_this.fileNameList));
							fileNameList[idx].progress = percentCompleted;
							_this.fileNameList = fileNameList;
						},
						success(res) {
							data.push({
								fileID: res.fileID,
								filename: `${_this.fileNameList[idx].name}.${_this.fileNameList[idx].suffix}`
							})
						},
						fail() {},
						complete() {
							num++;
							if(num == _this.fileNameList.length) {
								_this.loading = false;
								_this.$emit('on-success',data)
							}
						}
					});
				})
				
			},
			show() {
				this.dialogVisible = true;
				this.fileList = [];
			},
			hide() {
				this.dialogVisible = false;
			},
			upload() {
				var _this = this;
				uni.chooseImage({
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						_this.fileNameList = [];
						if (res.tempFiles && res.tempFiles.length) {
							res.tempFiles.forEach((item) => {
								var filename = item.name;
								var index = filename.lastIndexOf(".");
								var suffix = filename.substring(index+1);
								var name = filename.substring(0,index);
								_this.fileNameList.push({
									name,
									suffix,
									progress: 0
								});
							})
						}
						_this.fileList = res.tempFiles
					}
				});
			},
		},
	};
</script>

<style>
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
