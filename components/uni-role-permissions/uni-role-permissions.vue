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
				<el-tab-pane v-if="type==1" label="数据权限" name="data">
					<el-radio-group v-model="dataPermissions">
					    <el-radio :label="3">门店及子门店所属数据</el-radio>
					    <el-radio :label="6">门店所属数据</el-radio>
					    <el-radio :label="9">账号所属数据</el-radio>
					</el-radio-group>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dialogPermissions: false,
				dataPermissions: '',
				activeName: 'menu',
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
