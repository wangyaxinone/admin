<template>
    <view class="dishes">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item,idx) in deptlist" :key="idx">
			  <el-card @click.native="dishesByDept(item)" shadow="hover" style="cursor: pointer;height:100px;" :style="{'background-color': colors[idx],}">
				<text style="color:#fff;font-size:24px;font-weight: bold;">{{item.dept_name}}</text>
			  </el-card>
		  </el-col>
        </el-row>
    </view>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	import {getDeptByUser} from "@/api/system/user.js"
	import {getList} from "@/api/system/dept.js"
    export default {
        data() {
            return {
				deptlist:[],
				colors: [ '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#2f4554','#c4ccd3','#c23531']

            }
        },
		computed:{
			...mapState('app', ['isTenantAdminOrAdmin']),
			...mapState('user', ['userInfo']),
		},
        onLoad(e) {
            if(this.isTenantAdminOrAdmin){
				getList({
					isCook: 1,
					tenantId: this.$store.state.app.activeTenant
				}).then((res)=>{
					this.deptlist = res
				})
			}else{
				getDeptByUser({
					userId: this.userInfo._id
				}).then((res)=>{
					this.deptlist = res
				})
				
			}
        },
        methods: {
			dishesByDept(item){
				uni.navigateTo({
				    url: '/pages/dishes/dishesByDept?dept=' +item._id
				});
			}
        }
    }
</script>

<style lang="scss" scoped>
.dishes{
	padding:20px;
}
</style>
