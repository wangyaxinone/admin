<template>
    <view>
        <view>
            <text style="font-size: 25px;color: #333;">
                404 Page Not Found
            </text>
        </view>
        <view>
            <text style="font-size: 18px;color: #999;">
                {{isTenantAdminOrAdmin}}
            </text>
        </view>
    </view>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
    export default {
        data() {
            return {
				deptlist:[]
            }
        },
		computed:{
			...mapState('app', ['isTenantAdminOrAdmin']),
		},
        onLoad(e) {
            if(this.isTenantAdminOrAdmin){
				
			}else{
				this.deptlist = []
			}
        },
        methods: {

        }
    }
</script>

<style>

</style>
