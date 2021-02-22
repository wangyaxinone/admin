<template>
	<view>
		<h2>支持二次开发 加微信 s7952787</h2>
		<h3>平台功能</h3>
		<view style="color:#e4393c;">
			<h3>没有杂乱的营销功能，只有提升门店效率的功能</h3>
			<p>admin有所有权限，其他角色自行配置。门店管理员可登录平台查看自己权限内的门店</p>
		</view>
		<el-row>
			<el-col :span="12">
				<ol>
					<li>门店管理（多租户模式）</li>
					<li>用户管理</li>
					<li>角色管理（可配置角色页面权限和数据权限）</li>
					<li>部门管理</li>
					<li>系统菜单</li>
					<li>门店菜单</li>
					<li>权限模板</li>
					<li>字典管理</li>
				</ol>
			</el-col>
			<el-col :span="12">
				<el-image style="width: 100%" src="/static/1.png" fit="contain "></el-image>
			</el-col>
		</el-row>
		<h3>门店功能</h3>
		<ul style="color:#e4393c;">
			<li>门店管理员有除了订单删除外的所有权限，其他角色可自行配置权限</li>
			<li>对接了推送，实现实时订单和语音播报功能（goEasy推送）</li>
			<li>对接了打印机，可实现订单打印和分部门打印菜品（飞蛾打印机）</li>
			<li>对接了小程序，支持扫码点餐</li>
			<li>支持查看订单每道菜品付款情款，制作情况</li>
			<li>小程序端支持查看菜品制作情况，没做菜品一键作废。（顾客可以直接推掉没做菜品，提升顾客体验）</li>
		</ul>
		<el-row>
			<el-col :span="12">
				<ol>
					<li>
						商品管理
						<ul>
							<li>商品列表</li>
							<li>商品分类</li>
							<li>商品单位</li>
						</ul>
					</li>
					<li>
						订单管理（支持堂食和打包）（暂未对接外卖配送平台）
						<ul>
							<li>订单列表</li>
						</ul>
					</li>
					<li>
						餐桌管理
						<ul>
							<li>餐桌列表</li>
							<li>餐桌分类</li>
						</ul>
					</li>
					<li>
						菜品制作
					</li>
					<li>
						资源管理
					</li>
					<li>
						门店设置
						<ul>
							<li>门店设置</li>
							<li>小程序设置</li>
							<li>推送设置</li>
							<li>打印机设置</li>
							<li>菜品制作设置</li>
						</ul>
					</li>
				</ol>
			</el-col>
			<el-col :span="12">

			</el-col>
		</el-row>
		<el-image style="width: 100%" src="/static/2.png" fit="contain "></el-image>
		<el-image style="width: 100%" src="/static/3.png" fit="contain "></el-image>
	</view>
</template>

<script>
</script>

<style>
</style>
