<script>
	import {
		mapGetters,
		mapState,
		mapActions
	} from 'vuex'
	import config from '@/admin.config.js'
	export default {
		computed: {
			...mapGetters({
				isTokenValid: 'user/isTokenValid'
			}),
			...mapState('app', ['mode'])
		},
		watch:{
			'mode': {
				handler(neweValue,oldValue) {
					if(neweValue == oldValue) {
						return false;
					}
					if(this.$route.path == "/pages/login/login") {
						return false;
					}
					const loading = this.$loading({
						  lock: true,
						  text: 'Loading',
						  spinner: 'el-icon-loading',
						  background: 'rgba(0, 0, 0, 0.7)'
					});
					this.$store.dispatch('app/init').then(()=>{
						loading.close();
					}).catch(()=>{
						loading.close();
					})
				},
				deep: true,
			}
		},
		methods: {
			...mapActions({
				init: 'app/init',
				getMode: 'app/mode'
			})
		},
		onPageNotFound(msg) {
			uni.redirectTo({
				url: config.error.url
			})
		},
		onLaunch: function() {
			console.log('App Launch')
			if (!this.isTokenValid) {
				uni.navigateTo({
					url: config.login.url
				})
			} else {
				if(this.mode !=2){
					this.getMode().then(()=>{
						this.init()
					})
				}else{
					this.init()
				}
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import '@/common/uni.css';
	@import '@/common/uni-icons.css';
</style>
