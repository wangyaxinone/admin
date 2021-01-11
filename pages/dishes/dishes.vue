<template>
    <view class="dishes">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,idx) in deptlist" :key="idx">
			  <el-card shadow="hover" style="cursor: pointer;height:100px;" :style="{'background-color': colors[idx],}">
				<text style="color:#fff;font-size:24px;font-weight: bold;">{{item.dept_name}}</text>
			  </el-card>
		  </el-col>
        </el-row>
    </view>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	import {getDeptByUser} from "@/api/system/user.js"
    export default {
        data() {
            return {
				deptlist:[],
				colors: ['#c23531', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#2f4554','#c4ccd3']

            }
        },
		computed:{
			...mapState('app', ['isTenantAdminOrAdmin']),
			...mapState('user', ['userInfo']),
		},
        onLoad(e) {
            if(this.isTenantAdminOrAdmin){
				
			}else{
				getDeptByUser({
					userId: this.userInfo._id
				}).then((res)=>{
					this.deptlist = res
				})
				
			}
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
.dishes{
	padding:20px;
}
</style>
