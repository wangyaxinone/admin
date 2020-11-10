<template>
	<view>
		<el-dialog title="权限" :visible.sync="dialogPermissions" width="30%">
			<el-select v-model="value" placeholder="请选择">
			    <el-option
			      v-for="item in options"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
			<el-tabs v-model="activeName">
				<el-tab-pane label="菜单权限" name="menu">
					<el-tree ref="tree" :default-checked-keys="defaultCheckedKeys" :data="menusTree" default-expand-all check-strictly show-checkbox node-key="_id" :props="defaultProps">
					</el-tree>
					
				</el-tab-pane>
				<el-tab-pane v-if="type==1" label="数据权限" name="data">
					<el-tree class="dataTree" ref="data"  :data="dataPermissTree" :expand-on-click-node="false" default-expand-all  node-key="_id" :props="defaultProps">
						<view style="width:100%;" class="custom-tree-node" slot-scope="{ node, data }">
							<view style="float:left;">{{ node.label }}</view>
							<el-select size="mini" 
							v-if="!data.children || !data.children.length" 
							style="float:right;" 
							v-model="defaultCheckedData[data.url]" placeholder="请选择">
							    <el-option
							      v-for="item in options"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							</el-select>
						  </span>
						</view>
					</el-tree>
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
				dataPermissions: {},
				activeName: 'menu',
				radio: '',
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			};
		},
		props: {
			type: {
				type: String|Number
			},
			defaultCheckedKeys: {
				type: Array
			},
			defaultCheckedData: {
				type: Object
			},
			menusTree: {
				type: Array
			},
			dataPermissTree: {
				type: Array
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
					dataPermissions: this.defaultCheckedData,
					permissions
				})
			}
		}
	}
</script>

<style lang="scss">
	

</style>
