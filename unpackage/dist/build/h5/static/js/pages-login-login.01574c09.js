(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-login"],{3387:function(n,t,i){"use strict";i.r(t);var e=i("4301"),a=i("39b0");for(var o in a)"default"!==o&&function(n){i.d(t,n,(function(){return a[n]}))}(o);i("40ab");var s,r=i("f0c5"),u=Object(r["a"])(a["default"],e["b"],e["c"],!1,null,"64635e06",null,!1,e["a"],s);t["default"]=u.exports},3746:function(n,t,i){var e=i("d75c");"string"===typeof e&&(e=[[n.i,e,""]]),e.locals&&(n.exports=e.locals);var a=i("4f06").default;a("9984cc46",e,!0,{sourceMap:!1,shadowMode:!1})},"39b0":function(n,t,i){"use strict";i.r(t);var e=i("6560"),a=i.n(e);for(var o in e)"default"!==o&&function(n){i.d(t,n,(function(){return e[n]}))}(o);t["default"]=a.a},"40ab":function(n,t,i){"use strict";var e=i("3746"),a=i.n(e);a.a},4301:function(n,t,i){"use strict";i.d(t,"b",(function(){return a})),i.d(t,"c",(function(){return o})),i.d(t,"a",(function(){return e}));var e={uniForms:i("c8d2").default,uniFormsItem:i("7288").default},a=function(){var n=this,t=n.$createElement,i=n._self._c||t;return i("v-uni-view",{staticClass:"login-box"},[i("v-uni-view",{staticClass:"admin-logo"},[i("v-uni-image",{attrs:{src:n.logo,mode:"heightFix"}})],1),i("v-uni-view",{staticClass:"uni-header no-padding"},[i("v-uni-view",{staticClass:"uni-title"},[n._v("系统登录")])],1),i("v-uni-view",{staticClass:"uni-container"},[i("uni-forms",{ref:"form",attrs:{validateTrigger:"bind",rules:n.rules},on:{submit:function(t){arguments[0]=t=n.$handleEvent(t),n.submit.apply(void 0,arguments)}}},[i("uni-forms-item",{attrs:{"left-icon":"person",name:"username",labelWidth:"35"}},[i("v-uni-input",{ref:"usernameInput",staticClass:"uni-input-border",attrs:{type:"text",placeholder:"账户"},on:{confirm:function(t){arguments[0]=t=n.$handleEvent(t),n.confirmForm("username",t.detail.value)},blur:function(t){arguments[0]=t=n.$handleEvent(t),n.binddata("username",t.detail.value)}}})],1),i("uni-forms-item",{staticClass:"icon-container",attrs:{"left-icon":"locked",name:"password",labelWidth:"35"}},[i("v-uni-input",{staticClass:"uni-input-border",attrs:{password:n.showPassword,placeholder:"密码"},on:{confirm:function(t){arguments[0]=t=n.$handleEvent(t),n.confirmForm("password",t.detail.value)},blur:function(t){arguments[0]=t=n.$handleEvent(t),n.binddata("password",t.detail.value)}}}),i("v-uni-text",{staticClass:"uni-icon-password-eye pointer",class:[n.showPassword?"":"uni-eye-active"],on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.changePassword.apply(void 0,arguments)}}},[n._v("")])],1),i("v-uni-view",{staticClass:"uni-button-group"},[i("v-uni-button",{staticClass:"uni-button uni-button-full",attrs:{type:"primary",loading:n.loading,disabled:n.loading},on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.submitForm.apply(void 0,arguments)}}},[n._v("登录")])],1)],1),i("v-uni-view",{staticClass:"uni-tips"},[i("v-uni-text",{staticClass:"uni-tips-text",on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.initAdmin.apply(void 0,arguments)}}},[n._v("如无管理员账号，请先创建管理员...")])],1)],1)],1)},o=[]},6560:function(n,t,i){"use strict";var e=i("4ea4");i("d3b7"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=e(i("5530")),o=i("2f62"),s=e(i("814d")),r={data:function(){return(0,a.default)((0,a.default)({},s.default.navBar),{},{showPassword:!0,loading:!1,formData:{username:"",password:""},rules:{username:{rules:[{required:!0,errorMessage:"请输入账户"},{minLength:3,maxLength:30,errorMessage:"账户长度在{minLength}到{maxLength}个字符"}]},password:{rules:[{required:!0,errorMessage:"请输入正确的密码"},{minLength:6,errorMessage:"密码长度大于{minLength}个字符"}]}}})},mounted:function(){this.focus()},methods:(0,a.default)((0,a.default)((0,a.default)({},(0,o.mapActions)({init:"app/init"})),(0,o.mapMutations)({setToken:function(n,t){n("user/SET_TOKEN",t)}})),{},{submit:function(n){var t=this,i=n.detail,e=i.errors,a=i.value;e||(this.loading=!0,this.$request("user/login",a).then((function(n){return t.setToken({token:n.token,tokenExpired:n.tokenExpired}),t.init().then((function(){uni.showToast({title:"登录成功",icon:"none"}),uni.redirectTo({url:"/"})}))})).catch((function(n){})).finally((function(n){t.loading=!1})))},confirmForm:function(n,t){this.binddata(n,t),this.submitForm()},submitForm:function(){this.$refs.form.submit()},initAdmin:function(){uni.redirectTo({url:"/pages/demo/init/init"})},enter:function(n){13==n.keyCode&&this.submitForm("form")},changePassword:function(){this.showPassword=!this.showPassword},focus:function(){this.$refs.usernameInput.$refs.input.focus()}})};t.default=r},d75c:function(n,t,i){var e=i("24fb");t=e(!1),t.push([n.i,"uni-page-body[data-v-64635e06]{width:100%;height:100%;display:flex;justify-content:center;background-color:#fff}.login-box[data-v-64635e06]{position:relative;max-width:420px;flex:1;padding:140px 35px 0;margin:0 auto;overflow:hidden\n\t/* background-color: #F5F5F5; */}.underline[data-v-64635e06]:hover{text-decoration:underline}.uni-tips[data-v-64635e06]{display:flex;justify-content:flex-end;margin-top:15px}.uni-tips-text[data-v-64635e06]{cursor:pointer;text-decoration:underline;font-size:13px;color:#007aff;opacity:.8}.no-padding[data-v-64635e06]{padding:0}.admin-logo[data-v-64635e06]{display:flex;justify-content:center;margin-bottom:30px}.admin-logo uni-image[data-v-64635e06]{height:40px}body.?%PAGE?%[data-v-64635e06]{background-color:#fff}",""]),n.exports=t}}]);