<template>
	<view class="uni-container">
		<avue-crud :permission="permissionList" :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" @row-del="rowDel"
		 :before-open="beforeOpen" @row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
		 @selection-change="selectionChange" @on-load="loadData">
			<template slot-scope="scope" slot="addressForm">
				<avue-map v-model="map"></avue-map>
			</template>
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
			<template slot-scope="{type,size,row}" slot="menu">
				<el-button :disabled="!row.enable" :size="size" type="primary" @click="enterStoreHandle(row)">进入门店</el-button>
			</template>
		</avue-crud>
	</view>
</template>

<script>
	import {
		tree,
		add,
		update,
		remove
	} from "@/api/tenant/tenant.js"
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue'
	import {
		mapState,
		mapActions
	} from 'vuex'
	var _this
	export default {
		components: {
			uniDateformate
		},
		computed:{
			...mapState('app', ['navBtn']),
			 permissionList() {
				return {
				  addBtn: this.navBtn.tenant_tenant_add || false,
				  viewBtn:  this.navBtn.tenant_tenant_list|| false,
				  delBtn: this.navBtn.tenant_tenant_remove|| false,
				  editBtn: this.navBtn.tenant_tenant_update|| false,
				};
			  },
		},
		data() {
			return {
				loading: false,
				map: {
					formattedAddress: "",
					longitude: 0,
					latitude: 0,
				},
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
					defaultExpandAll: true,
					menuWidth: 300,
					column: [{
							label: "门店名称",
							prop: "name",
							search: true,
							width: 150,
							span: 12,
							rules: [{
								required: true,
								message: "请输入门店名称",
								trigger: "blur",
							}, ],
						},
						{
							label: "上级门店",
							prop: "parent_id",
							span: 12,
							type: 'tree',
							dicData: [],
							props: {
								label: "name",
								value: "_id"
							},
						},
						{
							label: "门店类型",
							prop: "type",
							span: 12,
							type: 'select',
							value: 1,
							dicData: [{
								label: '自营',
								value: 1
							}, {
								label: '加盟',
								value: 2
							}],
						},
						{
							label: "门店状态",
							prop: "enable",
							type: "switch",
							span: 12,
							value: true,
							dicData: [{
									label: "禁用",
									value: false,
								},
								{
									label: "启用",
									value: true,
								}
							],
						},
						{
							label: "门店地址",
							prop: "address",
							formslot: true,
							width: 250,
							span: 12,
							rules: [{
								required: true,
								message: "请输入门店名称",
								trigger: "blur",
							}, ],
						},
						{
							label: "创建时间",
							prop: "create_date",
							slot: true,
							width: 140,
							span: 12,
							display: false,
						},
					],
				},
				data: [],
			}
		},
		created() {
			_this = this;
		},
		watch: {
			map(newValue) {
				this.form.address = newValue.formattedAddress;
				this.form.longitude = newValue.longitude;
				this.form.latitude = newValue.latitude;
			}
		},
		methods: {
			enterStoreHandle(row) {
				this.$store.commit('app/set_ACTIVETENANTINFO',row)
				this.$store.commit('app/SET_MODE',2)
				this.$store.commit('app/SET_ACTIVETENANT',row._id)
				uni.redirectTo({
					url: '/'
				})
			},
			beforeOpen(done, type) {
				if (['view', 'edit'].includes(type)) {
					this.map = {
						formattedAddress: this.form.address,
						longitude: this.form.longitude,
						latitude: this.form.latitude,
					};
				} else {
					this.map = {
						formattedAddress: "",
						longitude: 0,
						latitude: 0,
					};
				}
				done();
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
				add(row).then(() => {
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
			selectionChange() {},
			loadData() {
				this.loading = true;
				tree(this.params).then((data) => {
					const column = _this.findObject(_this.option.column, "parent_id");
					column.dicData = data;
					this.data = data;
					this.loading = false;
				}).catch(() => {
					this.loading = false;
				})

			}
		}
	}
</script>
<style>
</style>
