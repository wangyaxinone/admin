<template>
	<view>
		<el-dialog title="权限" :visible.sync="dialogPermissions" width="30%">
			<el-select v-model="value" placeholder="请选择">
			    <el-option
			      v-for="item in templateList"
			      :key="item.value"
			      :label="(item.tenant && item.tenant[0] ? (item.tenant[0].name  + '-') : '') + item.name"
			      :value="item._id">
			    </el-option>
			</el-select>
			<el-tabs v-if="value=='self'" v-model="activeName">
				<el-tab-pane label="菜单权限" name="menu">
					<el-tree ref="tree" :default-checked-keys="defaultCheckedKeys" :data="menusTree" default-expand-all check-strictly show-checkbox node-key="_id" :props="defaultProps">
					</el-tree>
					
				</el-tab-pane>
				<el-tab-pane  label="数据权限" name="data">
					<view style="color:#e4393c;font-size:14px;text-align:center;padding-bottom:30px ">所有分门店的数据都将按此数据权限查询
					（门店没有开放新增权限，当前门店及子门店权限将自动变为当前门店权限）</view>
					<el-radio-group v-model="dataPermissions">
					    <el-radio :label="item.value" v-for="item in options" :key="item.value">{{item.label}}</el-radio>
					</el-radio-group>
				</el-tab-pane>
			</el-tabs>
			<view style="text-align:center;margin-top:20px;">
				<el-button size="small" type="primary" @click="submitMenuPermissions">保存</el-button>
				<el-button size="small" @click="dialogPermissions = false">取消</el-button>
			</view>
		</el-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				options: [
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
			},
			templateList: {
				type: Array
			},
			template: {
				type: String
			}
		},
		watch:{
			defaultCheckedData: {
				handler:function() {
					this.dataPermissions = this.defaultCheckedData;
				},
				immediate:true 
			},
			template:{
				handler:function() {
					this.$nextTick(() => {
						this.value = this.template;
					})
				},
				deep: true,
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
				var data = {
					value: this.value
				}
				if(this.value == 'self') {
					data.permissions = this.$refs.tree.getCheckedKeys();
					data.dataPermissions = this.dataPermissions;
				}else{
					this.templateList.forEach((item)=>{
						if(item._id == this.value) {
							data.permissions = item.permissions;
							data.dataPermissions = item.dataPermissions;
						}
					})
				}
				
				this.$emit('permissionsSubmit', data)
			}
		}
	}
</script>

<style lang="scss">
	

</style>
