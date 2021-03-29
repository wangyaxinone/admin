<template>
	<view>
		<el-dialog title="临时添加菜品" :visible.sync="dialogVisible" width="60%">
			<avue-form ref="form" v-model="form" :option="option" @reset-change="emptytChange" @submit="submit">
			</avue-form>
		</el-dialog>
	</view>
</template>

<script>
	export default {
		name: "addDishes",
		data() {
			return {
				dialogVisible: false,
				form: {},
				option: {
					column: [
						{
							label: "姓名",
							prop: "name",
						},
					]
				}
			};
		},
		methods: {
			show() {
				this.dialogVisible = true;
			}
		}
	}
</script>

<style lang="scss">

</style>
