<template>
	<view>
		<el-dialog title="制作中..." :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
		 :visible.sync="dialogVisible" width="50%">
			<el-table :data="tableData" stripe style="width: 100%">
				<el-table-column prop="goodsName" label="菜品图">
					<template slot-scope="scope">
						<el-image style="width: 50px; height: 50px" :src="scope.row.goodsSmallImg" fit="cover"></el-image>
					</template>
				</el-table-column>
				<el-table-column prop="goodsName" label="菜品名称">
				</el-table-column>
				<el-table-column prop="goodsAttrValue" label="菜品属性">
				</el-table-column>
				<el-table-column prop="order_comment" label="备注">
				</el-table-column>
				<el-table-column prop="every_day_code" label="订单编号">
				</el-table-column>
				<el-table-column prop="order_type" label="下单类型">
					<template slot-scope="scope">
						<el-tag type="danger" size="medium ">{{order_typeMap[scope.row.order_type]}}</el-tag>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button :loading="loading" @click="cencel">取 消</el-button>
				<el-button :loading="loading" type="primary" @click="submit">确 定</el-button>
			</span>
		</el-dialog>
	</view>
</template>

<script>
	import {
		getList,
		updateStatus
	} from '@/api/dishes/dishes.js';
	import { getDictByDictCode } from '@/api/system/dict.js';
	export default {
		data() {
			return {
				dialogVisible: false,
				tableData: [],
				loading: false,
				order_typeMap: {}
			};
		},
		created() {
			var _this = this;
			getDictByDictCode({
				dict_code: 'order_type'
			}).then((res) => {
				if(res && res.length){
					res.forEach((item)=>{
						_this.order_typeMap[item.dict_key] = item.dict_name;
					})
				}
			})
		},
		methods: {
			show() {
				getList({
					page: 1,
					size: 5,
					status: [2],
					operator: this.$store.state.user.userInfo._id
				}).then((res) => {
					var foods = res.data || [];
					this.tableData = foods;
					if(foods && foods.length) {
						this.dialogVisible = true;
					}else{
						this.dialogVisible = false;
					}
				})
			},
			cencel() {
				this.loading = true;
				var tenantId = this.tableData[0].tenantId;
				var _ids = this.tableData.map((item)=>{
					return item._id;
				})
				updateStatus({
					_ids,
					status: 1,
					tenantId
				}).then(()=>{
					this.loading = false;
					this.hide();
					this.$emit('load')
				}).catch(()=>{
					this.loading = false;
				})
			},
			submit() {
				this.loading = true;
				var tenantId = this.tableData[0].tenantId;
				var _ids = this.tableData.map((item)=>{
					return item._id;
				})
				updateStatus({
					_ids,
					status: 3,
					tenantId
				}).then(()=>{
					this.loading = false;
					this.hide();
					this.$emit('load')
				}).catch(()=>{
					this.loading = false;
				})
			},
			hide() {
				this.dialogVisible = false;
			}
		}
	}
</script>

<style lang="scss">

</style>
