<template>
	<div>
		<el-dialog title="资源库" :visible.sync="dialogFile" width="60%">
			<el-container>
				<el-main>
					<div>
						<el-button type="primary" @click="newFolder" size="small">新建文件夹</el-button>
						<el-button type="primary" @click="updateFile" size="small">上传文件</el-button>
					</div>
					<el-container v-loading="loading">
						<el-row style="width:100%;min-height:600px;margin-top:20px;">
							<el-col :span="24">
								<el-breadcrumb separator="/">
									<el-breadcrumb-item>
										<span @click="resertFolderRoute(0)" style="color:#66b1ff;cursor:pointer;">根目录</span>
									</el-breadcrumb-item>
									<el-breadcrumb-item v-for="(item,idx) in fileRoute" :key="idx">
										<span @click="resertFolderRoute(idx+1)" style="color:#66b1ff;cursor:pointer;">{{item.folderName}}</span>
									</el-breadcrumb-item>
								</el-breadcrumb>
							</el-col>
							<el-col :span="4" v-for="(item) in fileType" :key="item._id" style="text-align:center;cursor:pointer;padding:30px 0;height:100px;">
								<div  @click="pushRoute(item);">
									<el-card shadow="hover">
										<img :src="fileImg" alt style="height:84px" />
										<div style="text-align:center;cursor:pointer;height:22px;overflow:hidden;line-height:22px;white-space: nowrap;word-break: break-all;text-overflow: ellipsis;">{{item.folderName}}</div>
									</el-card>
								</div>
							</el-col>
							<el-col :span="4" v-for="(item) in files" :key="item._id" :gutter="10" style="text-align:center;cursor:pointer;padding:30px 0;height:100px;">
								<el-card @click.native="ok(item)">
									<el-image style="height:84px" :src="item.path" fit="contain" ></el-image>
									<div style="text-align:center;cursor:pointer;height:22px;overflow:hidden;line-height:22px;white-space: nowrap;word-break: break-all;text-overflow: ellipsis;">{{item.filename}}</div>
								</el-card>
							</el-col>
						</el-row>
					</el-container>
				</el-main>
			</el-container>
			<el-dialog append-to-body :title="title" :visible.sync="dialogVisible" width="50%">
				<avue-form ref="form" v-model="form" :option="option" @reset-change="emptytChange" @submit="submit"></avue-form>
			</el-dialog>
			<updateFile ref="updateFile" :tenantId="tenantId[0]" @on-success="onSuccess" :path="fileRoute.map((item)=>{return item.key}).join('/')"></updateFile>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import fileImg from "@/common/img/file.png";
	// import website from "@/config/website";
	import {
		getList,
		add,
		update,
		remove,
	} from "@/api/file/folder.js"
	import {
		add as addFile,
		getList as getFileList,
		remove as removeFile
	} from "@/api/file/file.js"
	import updateFile from "@/components/updateFile/updateFile.vue";
	export default {
		components: {
			updateFile,
		},
		data() {
			return {
				dialogFile: false,
				loading: false,
				fileRoute: [],
				files: [],
				title: "新建文件夹",
				fileType: [],
				fileImg,
				dialogVisible: false,
				tenantId: [],
				parentId: "",
				form: {
					folderName: "",
					tenantId: "",
					parentId: "",
					sort: 0,
					remark: "",
				},
				option: {
					column: [{
							label: "文件夹名",
							prop: "folderName",
							rules: [{
								required: true,
								message: "请输入文件夹名",
								trigger: "click",
							}, ],
						},
						{
							label: "排序",
							prop: "sort",
							type: "number",
						},
						{
							label: "备注",
							prop: "remark",
						},
					],
				},
			};
		},
		watch: {
			fileRoute: {
				handler() {
					if (this.fileRoute.length) {
						this.parentId = this.fileRoute[this.fileRoute.length - 1]._id;
					} else {
						this.parentId = "";
					}
					this.loadData();
				},
				deep: true,
			},
		},
		mounted() {
			this.loadData();
		},
		computed: {
			...mapGetters(["userInfo", "permission"]),
			permissionList() {
				return {
					addBtn: this.vaildData(this.permission.system_dept_add, false),
					viewBtn: this.vaildData(this.permission.system_dept_view, false),
					delBtn: this.vaildData(this.permission.system_dept_del, false),
					editBtn: this.vaildData(this.permission.system_dept_edit, false),
				};
			},
		},
		methods: {
			ok(item) {
				this.$emit('submit', item);
			},
			show(){
				this.dialogFile = true;
			},
			hide(){
				this.dialogFile = false;
			},
			downLoad(item) {
				window.location.href = item.path;
			},
			onSuccess(data) {
				var _this = this;
				uniCloud.getTempFileURL({
						fileList: data.map((item) => {
							return item.fileID
						}) || []
					})
					.then(res => {
						var data = [];
						if (res.fileList && res.fileList.length) {
							data = res.fileList.map((item) => {
								var filenameArr = item.download_url.split('/');
								var filename = filenameArr[filenameArr.length - 1];
								return {
									fileID: item.fileID,
									path: item.download_url,
									tenantId: _this.$store.state.app.activeTenant,
									filename,
									route: _this.fileRoute.map((item) => {
										return item.key
									}).join('/')
								}
							})
						}
						addFile(data).then(() => {
							this.getFiles();
						})
						this.$refs.updateFile.hide();
					});


			},
			getFiles() {
				this.files = [];
				this.loading = true;
				getFileList({
						route: this.fileRoute
							.map((item) => {
								return item.key;
							})
							.join("/"),
						tenantId: this.$store.state.app.activeTenant,
					})
					.then((res) => {
						this.files = res;
						this.loading = false;
					})
					.catch(() => {
						this.loading = false;
					});
			},
			updateFile() {
				this.$refs.updateFile.show();
			},
			resertFolderRoute(idx) {
				var fileRoute = JSON.parse(JSON.stringify(this.fileRoute));
				fileRoute.length = idx;
				this.fileRoute = fileRoute;
			},
			pushRoute(item) {
				this.fileRoute.push(item);
			},
			checkChange(item) {
				this.tenantId = [item._id];
				this.loadData();
			},
			submit(form, done) {
				var _this = this;
				var data = JSON.parse(JSON.stringify(this.form));
				data.tenantId = this.$store.state.app.activeTenant;
				var fullName = "";
				if (this.fileRoute && this.fileRoute.length) {
					fullName = this.fileRoute
						.map((item) => {
							return item.folderName;
						})
						.join("/");
				}
				data.fullName = `${fullName}/${data.folderName}`;
				if (data.fullName[0] != "/") {
					data.fullName = `/${data.fullName}`;
				}
				if (!data._id) {
					data.key = data.folderName;
				}
				if (data._id) {
					update(data).then(() => {
						done();
						_this.dialogVisible = false;
						_this.loadData();
					})
				} else {
					add(data).then(() => {
						done();
						_this.dialogVisible = false;
						_this.loadData();
					})
				}

			},
			remove() {

			},
			emptytChange() {
				this.form = {
					folderName: "",
					tenantId: "",
					parentId: "",
					sort: 0,
					remark: "",
				};
			},
			newFolder() {
				this.dialogVisible = true;

				this.form = {
					_id: "",
					folderName: "",
					fullName: "",
					tenantId: "",
					parentId: this.parentId,
					sort: 0,
					remark: "",
				};
				const column = this.findObject(this.option.column, "tenantId");
				column && (column.disabled = false);
			},
			delFile(item) {
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(() => {
						debugger
						removeFile({
							ids: [item.fileID]
						}).then(() => {
							this.$message({
								type: "success",
								message: "删除成功",
							});
							this.loadData();
						})
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
			delFolder(item) {
				this.$confirm(
						"此操作将永久删除该文件夹以及文件夹下的文件, 是否继续?",
						"提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning",
						}
					)
					.then(() => {
						remove({
							_ids: [item._id]
						}).then(() => {
							this.$message({
								type: "success",
								message: "删除成功",
							});
							this.loadData();
						})
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			},
			editFolder(item) {
				this.dialogVisible = true;
				this.title = "修改文件夹";
				this.form = item;
				const column = this.findObject(this.option.column, "tenantId");
				column.disabled = true;
			},
			loadData() {
				this.loading = true;
				getList({
						parentId: this.parentId,
						tenantId: this.$store.state.app.activeTenant
					})
					.then((res) => {
						this.fileType = res;
						this.loading = false;
						this.getFiles();
					})
					.catch((error) => {
						this.loading = false;
					});
			},
		},
	};
</script>

<style>
	.el-image-viewer__wrapper {
		z-index: 20000 !important;
	}
</style>
