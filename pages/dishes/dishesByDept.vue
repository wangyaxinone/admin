<template>
	<view class="uni-container">
		<el-breadcrumb separator-class="el-icon-arrow-right" style="padding:10px 0 30px">
			<el-breadcrumb-item :to="{ path: '/pages/dishes/dishes' }">菜品制作</el-breadcrumb-item>
			<el-breadcrumb-item>{{dept_name}}</el-breadcrumb-item>
		</el-breadcrumb>
		<avue-tabs ref="tabs" :option="tabOption" @change="handleChange"></avue-tabs>
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data"
			ref="crud" v-model="form" :search.sync="params" :before-open="beforeOpen" @row-del="rowDel"
			@row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
			@current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange"
			@on-load="loadData">
			<template slot="menu" slot-scope="{type,size, row}">
				<el-button v-if="row.status!=4 && navBtn.dishes_invalid" @click="invalid(row)"
					icon="el-icon-delete-solid" :type="type" size="small">作废</el-button>
				<el-button v-if="row.status==1 && navBtn.dishes_cook" @click="cook(row)" icon="el-icon-delete-solid"
					:type="type" size="small">制作</el-button>
			</template>
			<template slot-scope="scope" slot="menuLeft">
				<el-button type="primary" v-if="params.status==1 && navBtn.dishes_cook" size="small" plain>临时制作菜品
				</el-button>
				<el-button type="danger" v-if="params.status==1 && navBtn.dishes_cook" @click="cookList" size="small" plain>批量制作
				</el-button>
				<el-button type="danger" v-if="params.status!=4 && navBtn.dishes_invalid" @click="invalidList"
					size="small" plain>批量作废
				</el-button>
			</template>
			<template slot-scope="scope" slot="update_date">
				<uniDateformate :date="scope.row.update_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="status">
				<el-tag :type="scope.row.status==1 || scope.row.status==3?'info':'danger'">
					{{dishesZhiZuoMap[scope.row.status]}}
				</el-tag>
			</template>
			<template slot-scope="scope" slot="tableNameForm">
				<selectTable :label="form.tableName" @submit="submitTable"></selectTable>
			</template>
		</avue-crud>
		<selectGoods ref="selectGoods" :goodsList="form.goods_list || {}" @submit="submit"></selectGoods>
		<addFoods ref="addFoods" @submit="addFoodsSubmit"></addFoods>
		<cookFoods ref="cookFoods" @load="loadData"></cookFoods>
	</view>
</template>

<script>
	var _this;
	import {
		getList,
		add,
		cook,
		invalid
	} from '@/api/dishes/dishes.js';
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue';
	import selectGoods from '@/components/selectGoods/selectGoods.vue';
	import addFoods from '@/components/addFoods/addFoods.vue';
	import selectTable from '@/components/selectTable/selectTable.vue';
	import cookFoods from '@/components/cookFoods/cookFoods.vue';
	import {
		mapState,
		mapActions
	} from 'vuex';
	import config from '@/admin.config.js';
	import {
		getDictByDictCode
	} from '@/api/system/dict.js';
	export default {
		components: {
			uniDateformate,
			selectGoods,
			addFoods,
			selectTable,
			cookFoods
		},
		computed: {
			...mapState('app', ['navBtn']),
			permissionList() {
				return {
					addBtn: false,
					viewBtn: false,
					delBtn: false,
					editBtn: false
				};
			}
		},
		data() {
			return {
				activeName: 'zhiFu',
				dept_name: '',
				foodNum: 1,
				page: {
					pageSize: config.pages.pageSize,
					currentPage: config.pages.currentPage,
					total: 0
				},
				loading: false,
				dialogType: '',
				selection: [],
				form: {},
				params: {
					status: 1
				},
				type: {},
				tabOption: {
					column: []
				},
				option: {
					height: 'auto',
					calcHeight: 80,
					searchShow: true,
					searchMenuSpan: 6,
					rowKey: '_id',
					tip: false,
					tree: true,
					border: true,
					index: true,
					selection: true,
					viewBtn: true,
					addBtn: true,
					menuWidth: 150,
					column: [{
							label: '菜品名称',
							prop: 'goodsName',
							width: 120,
							search: true,
							span: 12,
							addDisplay: false,
							editDisplay: false
						},
						{
							label: '菜品属性',
							prop: 'goodsAttrValue',
							span: 12,
							addDisplay: false,
							editDisplay: false
						},
						{
							label: '备注',
							prop: 'order_comment',
							span: 12,
							width: 150,
							rules: [{
								required: false,
								message: '请输入备注',
								trigger: 'change'
							}]
						},
						{
							label: '订单编号',
							prop: 'orderNumber',
							search: true,
							width: 180,
							span: 12,
							addDisplay: false,
							editDisplay: false
						},
						{
							label: '下单类型',
							prop: 'order_type',
							span: 12,
							addDisabled: true,
							type: 'select',
							value: 2,
							dicData: [],
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
							rules: [{
								required: false,
								message: '请选择下单类型',
								trigger: 'change'
							}]
						},
						{
							label: '餐桌',
							prop: 'tableName',
							formslot: true,
							display: false,
							addDisplay: false,
							addDisabled: true,
						},
						{
							label: '菜品状态',
							prop: 'status',
							type: 'select',
							disabled: true,
							fixed: true,
							slot: true,
							value: 1,
							dicData: [],
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
						},
						{
							label: '订单状态',
							prop: 'order_status',
							type: 'select',
							disabled: true,
							value: 1,
							dicData: [],
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
						},

						{
							label: '创建时间',
							prop: 'create_date',
							addDisplay: false,
							editDisplay: false,
							width: 130,
							slot: true
						},
						{
							label: '最后一次操作时间',
							prop: 'update_date',
							addDisplay: false,
							editDisplay: false,
							width: 130,
							slot: true
						},
						{
							label: '最后一次操作人',
							prop: 'operator',
							addDisplay: false,
							editDisplay: false
						}
					]
				},
				data: [],
				dishesZhiZuoMap: {},
				dishesZhiFuMap: {}
			};
		},
		onLoad(e) {
			var params = JSON.parse(JSON.stringify(this.params));
			e.dept && (params.deptId = e.dept);
			this.dept_name = e.name;
			this.foodNum = e.foodNum;
			this.params = params;
			this.$eventBus.on('foodChange', () => {
				this.loadData();
			})
		},
		watch: {
			'form.order_type': (newValue, oldValue) => {
				const column = _this.findObject(_this.option.column, "tableName");
				if (newValue == 1) {
					column.display = true;
				} else {
					column.display = false;
				}

			}
		},
		created() {
			_this = this;
			getDictByDictCode({
				dict_code: 'dishes_status'
			}).then((res) => {
				const column = _this.findObject(_this.option.column, "status");
				column.dicData = res;
				_this.tabOption.column = res.map((item) => {
					_this.dishesZhiZuoMap[item.dict_key] = item.dict_name;
					return {
						label: item.dict_name,
						prop: item.dict_key,
					}
				}).filter((item) => {
					if (item.prop != 2) {
						return true;
					}
				})
				_this.type = _this.tabOption.column[0];
				_this.params.status = _this.params.status || parseFloat(_this.type.prop);
				_this.$nextTick(() => {
					_this.$refs.tabs.changeTabs(_this.params.status - 1);
				})
			})
			getDictByDictCode({
				dict_code: 'order_status'
			}).then((res) => {
				const column = _this.findObject(_this.option.column, "order_status");
				column.dicData = res;
			})

			getDictByDictCode({
				dict_code: 'order_type'
			}).then((res) => {
				const column = this.findObject(this.option.column, "order_type");
				column.dicData = res;
			})
		},
		mounted() {
			this.$refs.cookFoods.show();
		},
		methods: {
			invalidList() {
				if(!this.selection.length){
					this.$message.warning('至少选择一项！')
					return;
				}
				this.$confirm('确定将选择数据作废? ', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					invalid({
						_ids: this.selection.map((item)=>{return item._id}),
						tenantId: this.selection[0].tenantId
					}).then(res => {
						this.$message({
							message: '作废成功',
							type: 'success'
						});
						this.loadData();
					});
				});
			},
			cookList() {
				if(!this.selection.length){
					this.$message.warning('至少选择一项！')
					return;
				}
				this.$confirm('确定开始制作? ', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					getList({
						page: 1,
						size: 100,
						_ids: this.selection.map((item)=>{return item._id}),
						status: [1]
					}).then((res) => {
						var foods = res.data || [];
						var _ids = foods.map((item) => {
							return item._id;
						})
						debugger
						var tenantId = foods[0].tenantId;
						cook({
							_ids,
							tenantId
						}).then(() => {
							this.$refs.cookFoods.show();
							this.loadData();
						})
					})
				});
			},
			submitTable(data) {
				var form = JSON.parse(JSON.stringify(this.form))
				form.table = data._id;
				form.tableName = data.name;
				this.form = form;
			},
			addFoods(row) {
				this.$refs.addFoods.show(row);
			},
			cook(row) {
				this.$confirm('确定开始制作? ', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					getList({
						page: 1,
						size: parseFloat(this.foodNum),
						goodsName: row.goodsName,
						goodsAttrValue: row.goodsAttrValue,
						status: [1]
					}).then((res) => {
						var foods = res.data || [];
						var _ids = foods.map((item) => {
							return item._id;
						})
						var tenantId = foods[0].tenantId;
						cook({
							_ids,
							tenantId
						}).then(() => {
							this.$refs.cookFoods.show();
							this.loadData();
						})
					})
				});
			},
			invalid(row) {
				this.$confirm('确定将选择数据作废? ', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					invalid({
						_ids: [row._id],
						tenantId: row.tenantId
					}).then(res => {
						this.$message({
							message: '作废成功',
							type: 'success'
						});
						this.loadData();
					});
				});
			},
			addFoodsSubmit(data) {
				if (data.isLeave == 1) {
					this.$message({
						message: '顾客已经离店，不能加菜!',
						type: 'error'
					});
					return;
				}
				this.$refs.addFoods.loading = true;
				addFood(data).then((res) => {
					this.type = this.tabOption.column[0];
					this.params.status = this.type.prop;
					this.$refs.tabs.changeTabs(0);
					this.$refs.addFoods.loading = false;
					this.$refs.addFoods.hide();
					this.loadData();
					this.$message({
						message: '加菜成功',
						type: 'success'
					});
				}).catch(() => {
					this.$refs.addFoods.loading = false;
				})
			},
			submit(obj) {
				var form = JSON.parse(JSON.stringify(this.form))
				form.goods_list = obj;
				this.form = form;
				this.get_order_price();
				this.$refs.selectGoods.hide();
			},
			get_order_price() {
				var price = 0;
				var _this = this;
				if (this.form.goods_list) {
					Object.keys(this.form.goods_list).forEach((key) => {
						var item = this.form.goods_list[key];
						var currentPrice = parseFloat(_this.$NP.times(item.goodsPrice, item.num));
						price = _this.$NP.plus(price, currentPrice);
					})
				}
				this.form.order_price = price;
			},
			changeNumCar(item) {
				if (!item.num) {
					var id = `${item._id}-${item.goodsAttr.join('')}`;
					if (item.goodsAttrValue) {
						id = `${item._id}-${item.goodsAttrValue}`;
					}
					delete this.form.goods_list[id];
				}
				this.get_order_price();
			},
			selectGoods() {
				this.$refs.selectGoods.show();
			},
			handleChange(column) {
				this.type = column;
				this.params.status = column.prop;
				if (column.prop != 1) {
					this.option.addBtn = false;
				} else {
					this.option.addBtn = true;
				}
				this.loadData();
			},
			beforeOpen(done, type) {
				this.dialogType = type;
				const column = this.findObject(this.option.column, "amound_price");
				const no_order_price = this.findObject(this.option.column, "no_order_price");
				const no_amound_price = this.findObject(this.option.column, "no_amound_price");
				if (this.form.no_order_price && this.form.amound_price) {
					column.disabled = true;
				} else {
					column.disabled = false;
				}
				if (this.form.no_order_price && this.form.amound_price) {
					no_order_price.display = true;
					no_amound_price.display = true;
				} else {
					no_order_price.display = false;
					no_amound_price.display = false;
				}
				done();
			},
			rowDel(row) {
				if (row.children && row.children.length) {
					this.$message({
						message: '请先删除子菜单！',
						type: 'warning'
					});
					return;
				}
				this.$confirm('确定将选择数据删除?  删除后不可恢复！', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					remove({
						_ids: [row._id]
					}).then(res => {
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.loadData();
					});
				});
			},
			rowUpdate(row, index, done, loading) {
				if (row.isLeave == 1) {
					this.$message({
						message: '顾客已经离店，不能修改!',
						type: 'error'
					});
					done();
					return;
				}
				if (row.order_type != 1) {
					row.table = '';
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
					.catch(err => {
						done();
					});
			},
			rowSave(row, done, loading) {
				row.tenantId = this.$store.state.app.activeTenant;
				var newList = [];
				if (row.goods_list) {
					Object.keys(row.goods_list).forEach((key) => {
						var item = row.goods_list[key];
						if (item.num > 0) {
							newList.push({
								goodId: item._id,
								goodsName: item.goodsName,
								num: item.num,
								goodsAttrValue: item.goodsAttrValue,
								comment: row.comment,
								order_type: row.order_type
							})
						}

					})
				}
				row.goods_list = newList;
				add(row)
					.then(() => {
						this.loadData();
						this.$message({
							message: '新增成功',
							type: 'success'
						});
						done();
					})
					.catch(err => {
						done();
					});
			},
			searchReset() {
				this.params = {
					status: this.type.prop
				};
				this.loadData();
			},
			searchChange(params, done) {
				this.params = params;
				this.params.status = this.type.prop;
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
				var _this = this;
				this.$nextTick(() => {
					this.loading = true;
					this.params.page = this.page.currentPage;
					this.params.size = this.page.pageSize;
					this.params.tenantId = this.$store.state.app.activeTenant;
					var params = JSON.parse(JSON.stringify(this.params));
					params.status = params.status == 1 ? [1, 2] : [params.status];
					getList(params)
						.then(res => {
							this.loading = false;
							if (res.data && res.data.length) {
								res.data.forEach((item) => {
									if (item.operatorShow && item.operatorShow.length) {
										item.operator = item.operatorShow[0].nickname || item
											.operatorShow[0].username;
									}
									var tableName = [];
									if (item.tables && item.tables.length) {
										item.tables.forEach((child) => {
											tableName.push(child.name);
										})
									}
									item.tableName = tableName.join(',');
								})
							}
							this.data = res.data;
							this.page.total = res.total;
						})
						.catch(() => {
							this.loading = false;
						});
				});
			}
		}
	};
</script>
<style></style>
