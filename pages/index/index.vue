<template>
	<view style="padding: 15px;">
		<stores v-if="$store.state.app.activeTenant"></stores>
	</view>
</template>

<script>
	import stores from "./store.vue"
	export default {
		components:{stores},
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
