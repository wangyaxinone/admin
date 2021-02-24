export default {
	platform: 'pc', // 'ipad'//'pc'
	login: {
		url: '/pages/login/login' // 登录页面路径
	},
	error: {
		url: '/pages/error/404' // 404 Not Found 错误页面路径
	},
	pages: {
		pageSize: 10,
		currentPage: 1
	},
	navBar: { // 顶部导航
		logo: 'https://img.cdn.aliyun.dcloud.net.cn/uni-app/uniCloud/unicloudlogo.png', // 左侧 Logo
		links: [{ // 右侧链接
			text: 'Admin框架文档',
			url: 'https://uniapp.dcloud.net.cn/uniCloud/admin'
		}, {
			text: '浏览更多Admin插件',
			url: 'https://ext.dcloud.net.cn/?cat1=7&cat2=74'
		}],
		debug: {
			enable: process.env.NODE_ENV !== 'production', //是否显示错误信息
			engine: [{ // 搜索引擎配置（每条错误信息后，会自动生成搜索链接，点击后跳转至搜索引擎）
				name: '百度',
				url: 'https://www.baidu.com/baidu?wd=ERR_MSG'
			}, {
				name: '谷歌',
				url: 'https://www.google.com/search?q=ERR_MSG'
			}]
		}
	},
	sideBar: { // 左侧菜单
		// 配置静态菜单列表（放置在用户被授权的菜单列表下边）
		staticMenu: []
	}
}
