<template>
	<view style="padding: 15px;">
		<stores v-if="$store.state.app.activeTenant"></stores>
		<platform v-else></platform>
	</view>
</template>

<script>
	import stores from "./store.vue"
	import platform from "./platform.vue"
	export default {
		components:{stores,platform},
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {}
	}
</script>

<style>
</style>
