<template>
	<view>
		<el-dialog title="权限" :visible.sync="dialogPermissions" width="30%">
			<el-tabs v-model="activeName">
				<el-tab-pane label="菜单权限" name="menu">
					<el-tree ref="tree" :default-checked-keys="defaultCheckedKeys" :data="menusTree" default-expand-all check-strictly show-checkbox node-key="_id" :props="defaultProps">
					</el-tree>
					<view style="text-align:center;margin-top:20px;">
						<el-button size="small" type="primary" @click="submitMenuPermissions">保存</el-button>
						<el-button size="small">取消</el-button>
					</view>
				</el-tab-pane>
				<el-tab-pane label="数据权限" name="data">配置管理</el-tab-pane>
			</el-tabs>
		</el-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dialogPermissions: false,
				activeName: 'menu',
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			};
		},
		props: {
			defaultCheckedKeys: {
				type: Array
			},
			menusTree: {
				type: Array
			}
		},
		methods: {
			show() {
				this.dialogPermissions = true;
			},
			hide() {
				this.dialogPermissions = false;
			},
			submitMenuPermissions() {
				var permissions = this.$refs.tree.getCheckedKeys();
				this.$emit('permissionsSubmit', permissions)
			}
		}
	}
</script>

<style lang="scss">

</style>
