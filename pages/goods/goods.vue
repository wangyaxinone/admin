<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data" ref="crud"
		 v-model="form" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange"
		 @search-reset="searchReset" @current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange"
		 @on-load="loadData">
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="update_date">
				<uniDateformate :date="scope.row.update_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="goodsSmallImg">
				<el-image :src="scope.row.goodsSmallImg"></el-image>
			</template>
			<template slot-scope="scope" slot="goodsBigImg">
				<el-image :src="scope.row.goodsBigImg"></el-image>
			</template>
			<template slot-scope="scope" slot="packingPriceEvery">
				{{scope.row.packingPriceEvery?'是':'否'}}
			</template>
			<template slot-scope="scope" slot="goodsSmallImgForm">
				<div class="el-upload" @click="getgoodsImg('goodsSmallImg')">
					<img v-if="scope.row.goodsSmallImg" :src="scope.row.goodsSmallImg" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</div>
			</template>
			<template slot-scope="scope" slot="goodsBigImgForm">
				<div class="el-upload" @click="getgoodsImg('goodsBigImg')">
					<img v-if="scope.row.goodsBigImg" :src="scope.row.goodsBigImg" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</div>
			</template>
			<template slot-scope="scope" slot="menuLeft">
			    <el-button type="danger" size="small" plain @click="updateStatus(1)">批量上架</el-button>
			    <el-button type="danger" size="small" plain @click="updateStatus(2)">批量下架</el-button>
			    <el-button type="danger" size="small" plain @click="updatePackingPrice">批量设置包装费</el-button>
			    <el-button type="danger" size="small" plain @click="updateStockNumber">批量设置库存</el-button>
		  </template>
		</avue-crud>
		<selectFile ref="selectFile" @submit="getImg"></selectFile>
	</view>
</template>

<script>
	var _this
	import {
		getList,
		add,
		update,
		remove,
		updateGoods
	} from "@/api/goods/goods.js"
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js';
	import {
		tree as deptTree
	} from "@/api/system/dept.js"
	import {
		select,
	} from "@/api/goods/goods_type.js"
	import {
		select as unitSelect
	} from "@/api/goods/goods_unit.js"
	import {
		getDictByDictCode
	} from "@/api/system/dict.js"
	import selectFile from "@/components/selectFile/selectFile.vue"
	export default {
		components: {
			uniDateformate,
			selectFile
		},
		computed: {
			...mapState('app', ['navBtn']),
			permissionList() {
				return {
					addBtn: this.navBtn.goods_type_add || false,
					viewBtn: this.navBtn.goods_type_list || false,
					delBtn: this.navBtn.goods_type_remove || false,
					editBtn: this.navBtn.goods_type_update || false,
				};
			},
		},
		data() {
			return {
				page: {
					pageSize: config.pages.pageSize,
					currentPage: config.pages.currentPage,
					total: 0
				},
				loading: false,
				selection: [],
				form: {},
				params: {},
				option: {
					height: "auto",
					calcHeight: 80,
					searchShow: true,
					searchMenuSpan: 6,
					rowKey: "_id",
					tip: false,
					tree: true,
					border: true,
					index: true,
					selection: true,
					viewBtn: true,
					menuWidth:200,
					column: [{
							label: "商品小图",
							prop: "goodsSmallImg",
							formslot: true,
							slot: true
						},
						{
							label: "商品大图",
							prop: "goodsBigImg",
							formslot: true,
							slot: true
						},
						{
							label: "商品名称",
							prop: "goodsName",
							search: true,
							rules: [{
								required: true,
								message: "请输入商品名称",
								trigger: "blur"
							}],
						},
						{
							label: "所属部门",
							prop: "deptId",
							type: "tree",
							dicData: [],
							props: {
								label: "dept_name",
								value: "_id"
							},
							checkStrictly: true,
							rules: [{
								required: true,
								message: "请选择所属部门",
								trigger: "click"
							}]
						},
						{
							label: "商品类型",
							prop: "goodsType",
							multiple: true,
							type: "select",
							dicData: [],
							props: {
								label: "name",
								value: "_id"
							},
							rules: [{
								required: true,
								message: "请选择商品类型",
								trigger: "change"
							}]
						},
						{
							label: "商品单位",
							prop: "unit",
							type: "select",
							dicData: [],
							props: {
								label: "name",
								value: "_id"
							},
						},
						{
							label: "商品售价",
							prop: "goodsPrice",
							type: 'number',
							minRows: 0.1,
							rules: [{
								required: true,
								message: "请输入商品售价",
								trigger: "change"
							}]
						},
						{
							label: "商品会员价格",
							prop: "goodsVipPrice",
							minRows: 0.1,
							type: 'number',
						},
						{
							label: "商品成本",
							prop: "goodsCost",
							minRows: 0.1,
							type: 'number',
							rules: [{
								required: true,
								message: "请输入商品成本",
								trigger: "change"
							}]
						},
						{
							label: "包装费",
							prop: "packingPrice",
							minRows: 0,
							type: 'number',
						},
						{
							label: "包装费是否按件计价",
							prop: "packingPriceEvery",
							type: 'switch',
							slot: true,
							value: false,
						},
						{
							label: "商品属性",
							prop: "goodsAttr",
							type: "array",
							span: 24
						},
						{
							label: "库存",
							value: 9999,
							prop: "stockNumber",
							minRows: 0,
							type: 'number',
						},
						{
							label: "商品状态",
							prop: "status",
							type: 'select',
							value: 1,
							props: {
								label: "dict_name",
								value: "dict_key",
								disabled: "disabled"
							},
							dicData: [],
							span: 12,
						},
						{
							label: "备注",
							prop: "remark",
						},
						{
							label: "创建时间",
							prop: "create_date",
							addDisplay: false,
							editDisplay: false,
							width:130,
							slot: true,
						},
						{
							label: "最后一次操作时间",
							prop: "update_date",
							addDisplay: false,
							editDisplay: false,
							width:130,
							slot: true,
						},
						{
							label: "最后一次操作人",
							prop: "operator",
							addDisplay: false,
							editDisplay: false,
						}
					],
				},
				data: [],
				imgType:''
			}
		},
		created() {
			_this = this;
			deptTree({
				tenantId: this.$store.state.app.activeTenant,
				isCook: 1
			}).then((data) => {
				const column = this.findObject(this.option.column, "deptId");
				column.dicData = data;
			})
			select({
				tenantId: this.$store.state.app.activeTenant,
			}).then((data) => {
				const column = this.findObject(this.option.column, "goodsType");
				column.dicData = data;
			})
			unitSelect({
				tenantId: this.$store.state.app.activeTenant,
			}).then((data) => {
				const column = this.findObject(this.option.column, "unit");
				column.dicData = data;
			})
			getDictByDictCode({
				dict_code: 'goods_status'
			}).then((res) => {
				const column = this.findObject(this.option.column, "status");
				column.dicData = res;
			})
		},
		methods: {
			updatePackingPrice() {
				if(!this.selection || !this.selection.length) {
					this.$message({
						message: '请先选择商品！',
						type: 'warning'
					});
					return;
				}
				this.$prompt('请输入包装费', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValidator: function(value) {
						return value ? true : '不能为空';
					},
				}).then(({
					value
				}) => {
					var reg = new RegExp("^[0-9]*$");
					if(!reg.test(value)){
						this.$message({
							message: '请输入数字！',
							type: 'warning'
						});
						return;
					}
					updateGoods({
						_ids: this.selection.map((item)=>item._id),
						packingPrice: parseFloat(value)
					}).then(res => {
						this.$message({
							message: '作废成功',
							type: 'success'
						});
						this.loadData();
					});
				});
			},
			updateStockNumber() {
				if(!this.selection || !this.selection.length) {
					this.$message({
						message: '请先选择商品！',
						type: 'warning'
					});
					return;
				}
				this.$prompt('请输入库存', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValidator: function(value) {
						return value ? true : '不能为空';
					},
				}).then(({
					value
				}) => {
					var reg = new RegExp("^[0-9]*$");
					if(!reg.test(value)){
						this.$message({
							message: '请输入数字！',
							type: 'warning'
						});
						return;
					}
					updateGoods({
						_ids: this.selection.map((item)=>item._id),
						stockNumber: parseFloat(value)
					}).then(res => {
						this.$message({
							message: '作废成功',
							type: 'success'
						});
						this.loadData();
					});
				});
			},
			updateStatus(status) {
				if(this.selection && this.selection.length) {
					updateGoods({
						_ids: this.selection.map((item)=>item._id),
						status: status
					}).then((res)=>{
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						this.loadData();
					})
				}else{
					this.$message({
						message: '请先选择商品！',
						type: 'warning'
					});
				}
			},
			getImg(item) {
				this.form[this.imgType] = item.path;
				this.$refs.selectFile.hide();
			},
			getgoodsImg(type) {
				this.imgType = type;
				this.$refs.selectFile.show();
			},
			rowDel(row) {
				if (row.children && row.children.length) {
					this.$message({
						message: '请先删除子菜单！',
						type: 'warning'
					});
					return
				}
				this.$confirm("确定将选择数据删除?", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						remove({
								_ids: [row._id]
							})
							.then((res) => {
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.loadData();
							})
					})

			},
			rowUpdate(row, index, done, loading) {
				if(!row.goodsAttr.join('')) {
					row.goodsAttr = [];
				}
				update(row)
					.then(() => {
						this.loadData();
						this.$message({
							message: '修改成功',
							type: 'success'
						});
						done();
					})
					.catch((err) => {
						done();
					})


			},
			rowSave(row, done, loading) {
				row.tenantId = this.$store.state.app.activeTenant;
				if(!row.goodsAttr.join('')) {
					row.goodsAttr = [];
				}
				add(row)
					.then(() => {
						this.loadData();
						this.$message({
							message: '新增成功',
							type: 'success'
						});
						done();
					})
					.catch((err) => {
						done();
					})

			},
			searchReset() {
				this.params = {};
				this.loadData();
			},
			searchChange(params, done) {
				this.params = params;
				this.loadData();
				done();
			},
			selectionChange(selection) {
				this.selection = selection;
			},
			currentChange(currentPage) {
				this.page.currentPage = currentPage;
			},
			sizeChange(pageSize) {
				this.page.pageSize = pageSize;
			},
			loadData(clear = true) {
				this.$nextTick(() => {
					this.loading = true;
					this.params.page = this.page.currentPage;
					this.params.size = this.page.pageSize;
					this.params.tenantId = this.$store.state.app.activeTenant;
					getList(this.params).then((res) => {
						this.loading = false;
						if(res.data && res.data.length) {
							res.data.forEach((item)=>{
								item.operator = item.operatorShow[0].nickname || item.operatorShow[0].username;
							})
						}
						this.data = res.data;
						this.page.total = res.total;
					}).catch(() => {
						this.loading = false;
					})
					
				})
			}
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
