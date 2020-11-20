<template>
	<view>
		<el-dialog title="权限" :visible.sync="dialogPermissions" width="30%">
			<el-tabs v-model="activeName">
				<el-tab-pane label="菜单权限" name="menu">
					<el-tree ref="tree" :default-checked-keys="defaultCheckedKeys" :data="menusTree" default-expand-all check-strictly show-checkbox node-key="_id" :props="defaultProps">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane v-if="type==1" label="数据权限" name="data">
					<view style="color:#e4393c;font-size:14px;text-align:center;padding-bottom:30px ">所有分门店的数据都将按此数据权限查询（门店没有开放新增权限，当前门店及子门店权限将自动变为当前门店权限）</view>
					<el-radio-group v-model="dataPermissions">
					    <el-radio :label="item.value" v-for="item in options" :key="item.value">{{item.label}}</el-radio>
					</el-radio-group>
				</el-tab-pane>
			</el-tabs>
			<view style="text-align:center;margin-top:20px;">
				<el-button size="small" type="primary" @click="submitMenuPermissions">保存</el-button>
				<el-button size="small">取消</el-button>
			</view>
		</el-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: [
					{
						label: '当前门店及子门店',
						value: '1'
					},
					{
						label: '当前门店',
						value: '2'
					},
					{
						label: '当前用户',
						value: '3'
					}
				],
				dialogPermissions: false,
				dataPermissions: '',
				activeName: 'menu',
				radio: '',
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			};
		},
		props: {
			isAdminTemplate: {
				type: String|Number
			},
			type: {
				type: String|Number
			},
			defaultCheckedKeys: {
				type: Array
			},
			defaultCheckedData: {
				type: String|Number
			},
			menusTree: {
				type: Array
			},
			dataPermissTree: {
				type: Array
			}
		},
		watch:{
			defaultCheckedData: {
				handler:function() {
					this.dataPermissions = this.defaultCheckedData;
				},
				immediate:true 
			},
			isAdminTemplate:{
				handler:function() {
					if(this.isAdminTemplate == '1') {
						this.options = [
							{
								label: '当前门店及子门店',
								value: 1
							},
							{
								label: '当前门店',
								value: 2
							},
							{
								label: '当前用户',
								value: 3
							}
						];
					}else{
						this.options = [
							{
								label: '当前门店',
								value: 2
							},
							{
								label: '当前用户',
								value: 3
							}
						];
					}
				},
				immediate:true 
			}
		},
		methods: {
			clickHandle(node,data) {
			},
			show() {
				this.dialogPermissions = true;
			},
			hide() {
				this.dialogPermissions = false;
			},
			submitMenuPermissions() {
				var permissions = this.$refs.tree.getCheckedKeys();
				this.$emit('permissionsSubmit', {
					dataPermissions: this.dataPermissions,
					permissions
				})
			}
		}
	}
</script>

<style lang="scss">
	

</style>
