<template>
	<view class="uni-container">
		<avue-tabs ref="tabs" :option="tabOption" @change="handleChange"></avue-tabs>
		<avue-crud :permission="permissionList" :page="page" :option="option" :table-loading="loading" :data="data"
			ref="crud" v-model="form" :search.sync="params" :before-open="beforeOpen" @row-del="rowDel"
			@row-update="rowUpdate" @row-save="rowSave" @search-change="searchChange" @search-reset="searchReset"
			@current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange"
			@on-load="loadData">
			<template slot="menu" slot-scope="{type,size, row}">
				<el-button v-if="row.status!=3 && navBtn.order_list_invalid" @click="invalid(row)"
					icon="el-icon-delete-solid" :type="type" size="small">作废</el-button>
				<el-button v-if="row.status!=3 && navBtn.order_list_addFoods" @click="addFoods(row)"
					icon="el-icon-delete-solid" :type="type" size="small">加菜</el-button>
			</template>
			<template slot-scope="scope" slot="update_date">
				<uniDateformate :date="scope.row.update_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="create_date">
				<uniDateformate :date="scope.row.create_date"></uniDateformate>
			</template>
			<template slot-scope="scope" slot="tableNameForm">
				<selectTable :label="form.tableName" @submit="submitTable"></selectTable>
			</template>
			<template slot-scope="scope" slot="numberForm">
				<div>
					<el-button v-if="dialogType == 'add'" type="primary" @click="selectGoods">点菜</el-button>
					<el-card v-if="dialogType == 'add'" style="margin-top:5px;"
						v-for="(item,key) in scope.row.goods_list" :key="key">
						<el-row :gutter="20">
							<el-col :span="6" style="text-align: center;">
								{{ item.goodsName }}
								<span v-if="item.goodsAttrValue">（{{ item.goodsAttrValue }}）</span>
							</el-col>
							<el-col :span="6" style="text-align: center;">
								<span style="color:#e4393c;font-weight: bold;">{{ item.goodsPrice }}元</span>
							</el-col>
							<el-col :span="6" style="text-align: center;">
								<el-input-number style="width:100px;" size="mini" @change="changeNumCar(item)"
									v-model="item.num" controls-position="right" :min="0"></el-input-number>
							</el-col>
							<el-col :span="6" style="text-align: center;">
								<span
									style="color:#e4393c;font-weight: bold;">{{ $NP.times(item.goodsPrice, item.num)}}元</span>
							</el-col>
						</el-row>
					</el-card>
					<div v-if="dialogType == 'add' && form.order_type == 2 && form.allPackingPrice"
						style="text-align: right;padding:0 20px;">
						包装费：<span style="color:#e4393c;font-weight: bold;">{{form.allPackingPrice}}元</span>
					</div>
					<div v-if="dialogType == 'add' && form.order_type == 1 && form.utensilsPrice"
						style="text-align: right;padding:0 20px;">
						餐具费：<span style="color:#e4393c;font-weight: bold;">{{form.utensilsPrice}}元</span>
					</div>
					<el-tabs v-if="dialogType !== 'add'" v-model="activeName" type="border-card"
						style="margin-top:10px;">
						<el-tab-pane label="支付情况" name="zhiFu">
							<div v-for="(foodList,key) in scope.row.foodsMapZhiFu" :key="key">
								<el-alert style="margin-top:5px;" :title="dishesZhiFuMap[key]"
									:type="key==1 || key==3? 'error': 'success'" :closable="false"></el-alert>
								<el-card style="margin-top:5px;" v-for="(item,key) in foodList" :class="{disabled: item.status==4}" :key="key">
									<el-row :gutter="20">
										<el-col :span="5" style="text-align: center;">
											{{ item.goodsName }}
											<span v-if="item.goodsAttrValue">（{{ item.goodsAttrValue }}）</span>
										</el-col>
										<el-col :span="5" style="text-align: center;">
											<span style="color:#e4393c;font-weight: bold;">{{ item.goodsPrice }}元</span>
										</el-col>
										<el-col :span="5" style="text-align: center;">
											x {{item.num}}
										</el-col>
										<el-col :span="5" style="text-align: center;">
											<span
												style="color:#e4393c;font-weight: bold;">{{ $NP.times(item.goodsPrice, item.num)}}元</span>
										</el-col>
										<el-col :span="4" style="text-align: center;">
											<el-button v-if="item.status!=4" @click="foodInvalid(item, scope)"
												type="danger" icon="el-icon-delete" circle></el-button>
										</el-col>
									</el-row>
								</el-card>
							</div>
							<div v-if="scope.row.order_type == 2 && scope.row.allPackingPrice"
								style="text-align: right;padding:20px;">
								包装费：<span
									style="color:#e4393c;font-weight: bold;">{{scope.row.allPackingPrice}}元</span>
							</div>
							<div v-if="scope.row.order_type == 1 && scope.row.utensilsPrice"
								style="text-align: right;padding:20px;">
								餐具费：<span
									style="color:#e4393c;font-weight: bold;">{{scope.row.utensilsPrice}}元</span>
							</div>
						</el-tab-pane>
						<el-tab-pane label="制作情况" name="zhiZuo">
							<div v-for="(foodList,key) in scope.row.foodsMapZhiZuo" :key="key">
								<el-alert style="margin-top:5px;" :title="dishesZhiZuoMap[key]"
									:type="key==1 ||　key==4? 'error': 'success'" :closable="false"></el-alert>
								<el-card style="margin-top:5px;" v-for="(item,key) in foodList"  :class="{disabled: item.status==4}" :key="key">
									<el-row :gutter="20">
										<el-col :span="5" style="text-align: center;">
											{{ item.goodsName }}
											<span v-if="item.goodsAttrValue">（{{ item.goodsAttrValue }}）</span>
										</el-col>
										<el-col :span="5" style="text-align: center;">
											<span style="color:#e4393c;font-weight: bold;">{{ item.goodsPrice }}元</span>
										</el-col>
										<el-col :span="5" style="text-align: center;">
											x {{item.num}}
										</el-col>
										<el-col :span="5" style="text-align: center;">
											<span
												style="color:#e4393c;font-weight: bold;">{{ $NP.times(item.goodsPrice, item.num)}}元</span>
										</el-col>
										<el-col :span="4" style="text-align: center;">
											<el-button v-if="item.status!=4" @click="foodInvalid(item, scope)"
												type="danger" icon="el-icon-delete" circle></el-button>
										</el-col>
									</el-row>
								</el-card>
							</div>
						</el-tab-pane>
					</el-tabs>

				</div>
			</template>
		</avue-crud>
		<selectGoods ref="selectGoods" :goodsList="form.goods_list || {}" @submit="submit"></selectGoods>
		<addFoods ref="addFoods" @submit="addFoodsSubmit"></addFoods>
	</view>
</template>

<script>
	var _this;
	import {
		getList,
		add,
		update,
		remove,
		invalid,
		addFood
	} from '@/api/order/order.js';
	import {
		invalid as foodInvalid
	} from '@/api/dishes/dishes.js';
	import uniDateformate from '@/components/uni-dateformat/uni-dateformat.vue';
	import selectGoods from '@/components/selectGoods/selectGoods.vue';
	import addFoods from '@/components/addFoods/addFoods.vue';
	import selectTable from '@/components/selectTable/selectTable.vue';
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
			selectTable
		},
		computed: {
			...mapState('app', ['navBtn']),
			permissionList() {
				return {
					addBtn: this.navBtn.order_list_add || false,
					viewBtn: this.navBtn.order_list_list || false,
					delBtn: this.$store.state.user.userInfo.role.indexOf('admin') > -1 || false,
					editBtn: this.params.status == 3 ? false : (this.navBtn.order_list_update || false)
				};
			}
		},
		data() {
			return {
				activeName: 'zhiFu',
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
					selection: false,
					viewBtn: true,
					addBtn: true,
					menuWidth: 300,
					column: [{
							label: '订单编号',
							prop: 'order_number',
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
							type: 'select',
							value: 1,
							dicData: [],
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
							rules: [{
								required: true,
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
							rules: [{
								required: false,
								message: '请选择餐桌',
								trigger: 'change'
							}]
						},
						
						{
							label: '菜品数量',
							prop: 'number',
							formslot: true,
							span: 24
						},
						{
							label: '就餐人数',
							prop: 'eatPeople',
							type: 'number',
							minRows: 1,
							value: 1
						},
						{
							label: '订单总价',
							prop: 'order_price',
							disabled: true
						},
						{
							label: '实付金额',
							prop: 'amound_price',
							disabled: false,
							type: 'number',
							minRows: 0,
							precision: 2,
						},
						{
							label: '订单状态',
							prop: 'status',
							type: 'select',
							value: 1,
							dicData: [],
							addDisabled: true,
							props: {
								label: 'dict_name',
								value: 'dict_key'
							},
						},
						{
							label: '备注',
							prop: 'comment',
							span: 12,
							width: 150,
							rules: [{
								required: false,
								message: '请输入备注',
								trigger: 'change'
							}]
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
			e.order_number && (params.order_number = e.order_number);
			e.status && (params.status = parseFloat(e.status));
			this.params = params;
			this.$eventBus.on('orderChange', () => {
				this.loadData();
			})

		},
		watch: {
			'form.order_type': function(newValue, oldValue) {
				const column = _this.findObject(_this.option.column, "tableName");
				if (newValue == 1) {
					column.display = true;
				} else {
					column.display = false;
				}
				this.get_order_price();
			},
			'form.eatPeople': function(newValue, oldValue) {
				this.get_order_price();
			}
		},
		created() {
			_this = this;
			getDictByDictCode({
				dict_code: 'order_status'
			}).then((res) => {
				const column = _this.findObject(_this.option.column, "status");
				column.dicData = res;
				_this.tabOption.column = res.map((item) => {
					return {
						label: item.dict_name,
						prop: item.dict_key,
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
				var dishesZhiFuMap = {};
				res.forEach((item) => {
					dishesZhiFuMap[item.dict_key] = item.dict_name;
				})
				this.dishesZhiFuMap = dishesZhiFuMap;
			})
			getDictByDictCode({
				dict_code: 'dishes_status'
			}).then((res) => {
				var dishesZhiZuoMap = {};
				res.forEach((item) => {
					dishesZhiZuoMap[item.dict_key] = item.dict_name;
				})
				this.dishesZhiZuoMap = dishesZhiZuoMap;
			})
			getDictByDictCode({
				dict_code: 'order_type'
			}).then((res) => {
				const column = this.findObject(this.option.column, "order_type");
				column.dicData = res;
			})
		},
		methods: {
			foodInvalid(item, scope) {
				var _this = this;
				var {
					row,
					index
				} = scope;
				this.$confirm('确定将选择数据作废? ', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					foodInvalid({
						_ids: [item._id],
						tenantId: item.tenantId,
						orderId: item.orderId
					}).then(res => {
						this.$message({
							message: '作废成功',
							type: 'success'
						});
						this.loadData(true, 'edit', row, index);
						var children = _this.$refs.crud.$children || [];
						children.forEach((item) => {
							if (item.boxType && item.boxType == 'edit') {
								item.boxVisible = false;
							}
						})
					});
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
			invalid(row) {
				this.$prompt('请输入作废原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValidator: function(value) {
						return value ? true : '不能为空';
					},
				}).then(({
					value
				}) => {
					invalid({
						_ids: [row._id],
						tenantId: row.tenantId,
						comment: value
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
				var packingPriceEveryMap = {};
				var allPackingPrice = 0;
				var utensilsPrice = 0;
				if (_this.form.goods_list) {
					Object.keys(_this.form.goods_list).forEach((key, idx) => {
						var item = _this.form.goods_list[key];
						var currentPrice = parseFloat(_this.$NP.times(item.goodsPrice, item.num));
						if (_this.form.order_type == 2) {
							if (item.packingPriceEvery) {
								allPackingPrice = _this.$NP.plus(allPackingPrice, _this.$NP.times(item
									.packingPrice, item.num));
							} else {
								if (!packingPriceEveryMap[item._id]) {
									allPackingPrice = _this.$NP.plus(allPackingPrice, item.packingPrice);
									packingPriceEveryMap[item._id] = true;
								}
							}

						}
						price = _this.$NP.plus(price, currentPrice);
					})
				} else if (_this.form.foods && _this.form.foods.length) {
					_this.form.foods.forEach((item, idx) => {
						if(item.status == 4) {
							return;
						}
						var currentPrice = parseFloat(_this.$NP.times(item.goodsPrice, 1));
						if (_this.form.order_type == 2) {
							if (item.packingPriceEvery) {
								allPackingPrice = _this.$NP.plus(allPackingPrice, _this.$NP.times(item
									.packingPrice, 1));
							} else {
								if (!packingPriceEveryMap[item._id]) {
									allPackingPrice = _this.$NP.plus(allPackingPrice, item.packingPrice);
									packingPriceEveryMap[item._id] = true;
								}
							}

						}
						price = _this.$NP.plus(price, currentPrice);
					})
				}
				if (_this.form.order_type == 1) {
					utensilsPrice = _this.$NP.plus(utensilsPrice, _this.$NP.times(_this.$store.state.app.activeTenantInfo
						.utensils || 0, _this.form.eatPeople));
				}
				price = _this.$NP.plus(price, allPackingPrice, utensilsPrice);
				_this.form.allPackingPrice = allPackingPrice || _this.form.allPackingPrice;
				_this.form.utensilsPrice = utensilsPrice || _this.form.utensilsPrice;
				_this.form.order_price = price || _this.form.order_price;
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
				var _this = this;
				_this.dialogType = type;
				if (type == 'add') {
					setTimeout(() => {
						_this.form.goods_list = {};
						_this.form.order_type = 1;
						_this.form.tableName = '';
						_this.form.table = '';
						_this.form.status = 1;
						_this.form.eatPeople = 1;
						_this.form.order_price = '';
						_this.form.amound_price = '';
						_this.form.comment = '';
					}, 0)
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
						_ids: [row._id],
						tenantId: row.tenantId
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
				row.utensils = _this.$store.state.app.activeTenantInfo.utensils || 0;
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
			async loadData(clear = true, type, row, index) {
				var _this = this;
				this.$nextTick(() => {
					this.loading = true;
					this.params.page = this.page.currentPage;
					this.params.size = this.page.pageSize;
					this.params.tenantId = this.$store.state.app.activeTenant;
					getList(this.params)
						.then(res => {
							this.loading = false;
							if (res.data && res.data.length) {
								res.data.forEach((item) => {
									item.operator = item.operatorShow[0].nickname || item
										.operatorShow[0].username;
									var foodsMapZhiZuo = {};
									var foodsMapZhiFu = {};
									var no_order_price = 0;
									var tableName = [];
									if (item.foods && item.foods.length) {
										item.foods.forEach((food) => {
											foodsMapZhiZuo[food.status] = foodsMapZhiZuo[
												food.status] || {};
											foodsMapZhiZuo[food.status][food.goodsId + food
												.goodsAttrValue
											] = foodsMapZhiZuo[food.status][food
												.goodsId + food.goodsAttrValue
											] || JSON.parse(JSON.stringify(food));
											foodsMapZhiZuo[food.status][food.goodsId + food
												.goodsAttrValue
											].num = foodsMapZhiZuo[food.status][food
												.goodsId + food.goodsAttrValue
											].num || 0;
											foodsMapZhiZuo[food.status][food.goodsId + food
												.goodsAttrValue
											].num++;

											foodsMapZhiFu[food.order_status] =
												foodsMapZhiFu[food.order_status] || {};
											foodsMapZhiFu[food.order_status][food.goodsId +
												food.goodsAttrValue
											] = foodsMapZhiFu[food.order_status][food
												.goodsId + food.goodsAttrValue
											] || JSON.parse(JSON.stringify(food));
											foodsMapZhiFu[food.order_status][food.goodsId +
												food.goodsAttrValue
											].num = foodsMapZhiFu[food.order_status][
												food.goodsId + food.goodsAttrValue
											].num || 0;
											foodsMapZhiFu[food.order_status][food.goodsId +
												food.goodsAttrValue
											].num++;

											if (food.order_status === 1) {
												no_order_price = _this.$NP.plus(
													no_order_price, food.goodsPrice);
											}
										})
									}
									if (item.tables && item.tables.length) {
										item.tables.forEach((child) => {
											tableName.push(child.name);
										})
									}
									item.tableName = tableName.join(',');
									item.no_order_price = no_order_price;
									item.foodsMapZhiZuo = foodsMapZhiZuo;
									item.foodsMapZhiFu = foodsMapZhiFu;

								})
							}
							this.data = res.data;
							this.page.total = res.total;
							if (type == 'edit') {
								_this.$refs.crud.rowEdit(this.data[index], index);
							}
						})
						.catch(() => {
							this.loading = false;
						});
				});
			}
		}
	};
</script>
<style>
	.el-card.disabled{
		cursor: not-allowed;
	}
	.el-card.disabled span{
		text-decoration:line-through;
		color: #333 !important;
	}
</style>
