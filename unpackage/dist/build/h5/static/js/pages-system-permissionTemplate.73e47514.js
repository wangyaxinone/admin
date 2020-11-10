(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-system-permissionTemplate"],{4494:function(e,t,n){"use strict";n("a9e3"),n("e25e"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n("3153"),r={name:"uniDateformat",props:{date:{type:[Object,String,Number],default:function(){return Date.now()}},locale:{type:String,default:"zh"},threshold:{type:Array,default:function(){return[0,0]}},format:{type:String,default:"yyyy/MM/dd hh:mm:ss"},refreshRate:{type:[Number,String],default:0}},data:function(){return{refreshMark:0}},computed:{dateShow:function(){return this.refreshMark,(0,a.friendlyDate)(this.date,{locale:this.locale,threshold:this.threshold,format:this.format})}},watch:{refreshRate:{handler:function(){this.setAutoRefresh()},immediate:!0}},methods:{refresh:function(){this.refreshMark++},setAutoRefresh:function(){var e=this;clearInterval(this.refreshInterval),this.refreshRate&&(this.refreshInterval=setInterval((function(){e.refresh()}),parseInt(this.refreshRate)))}}};t.default=r},"84a9":function(e,t,n){"use strict";var a=n("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,i=a(n("5530")),s=n("9490"),o=n("8db5"),u=a(n("e6a2")),c=n("2f62"),d=a(n("814d")),l={components:{uniDateformate:u.default},computed:(0,i.default)((0,i.default)({},(0,c.mapState)("app",["navBtn"])),{},{permissionList:function(){return{addBtn:this.navBtn.system_dept_add||!1,viewBtn:this.navBtn.system_dept_list||!1,delBtn:this.navBtn.system_dept_remove||!1,editBtn:this.navBtn.system_dept_update||!1}}}),data:function(){return{page:{pageSize:d.default.pages.pageSize,currentPage:d.default.pages.currentPage,total:0},loading:!1,selection:[],form:{},params:{},option:{height:"auto",calcHeight:80,searchShow:!0,searchMenuSpan:6,rowKey:"_id",tip:!1,border:!0,index:!0,selection:!0,viewBtn:!0,menuWidth:300,column:[{label:"模板名称",prop:"name",search:!0,width:200,span:12,rules:[{required:!0,message:"请输入模板名称",trigger:"blur"}]},{label:"所属门店",prop:"tenantId",type:"tree",span:12,width:150,dicData:[],props:{label:"name",value:"_id"},search:!0,rules:[{required:!1,message:"请输入所属租户",trigger:"change"}]},{label:"排序",prop:"sort",span:12,type:"number",rules:[{required:!1,message:"请输入备注",trigger:"change"}]},{label:"备注",prop:"comment",span:12,width:150,rules:[{required:!1,message:"请输入备注",trigger:"change"}]},{label:"创建时间",prop:"create_date",slot:!0,width:150,span:12,display:!1}]},data:[]}},created:function(){r=this,(0,s.tree)().then((function(e){var t=r.findObject(r.option.column,"tenantId");t.dicData=e}))},methods:{rowDel:function(e){var t=this;e.children&&e.children.length?this.$message({message:"请先删除子菜单！",type:"warning"}):this.$confirm("确定将选择数据删除?",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){(0,o.remove)({_ids:[e._id]}).then((function(e){t.$message({message:"删除成功",type:"success"}),t.loadData()}))}))},rowUpdate:function(e,t,n,a){var r=this;(0,o.update)(e).then((function(){r.loadData(),r.$message({message:"修改成功",type:"success"}),n()})).catch((function(e){n()}))},rowSave:function(e,t,n){var a=this;(0,o.add)(e).then((function(){a.loadData(),a.$message({message:"新增成功",type:"success"}),t()})).catch((function(e){t()}))},searchReset:function(){this.params={},this.loadData()},searchChange:function(e,t){this.params=e,this.loadData(),t()},selectionChange:function(e){this.selection=e},currentChange:function(e){this.page.currentPage=e},sizeChange:function(e){this.page.pageSize=e},loadData:function(){var e=this;this.$nextTick((function(){e.loading=!0,e.params.page=e.page.currentPage,e.params.size=e.page.pageSize,(0,o.getList)(e.params).then((function(t){e.loading=!1,e.data=t.data,e.page.total=t.total})).catch((function(){e.loading=!1}))}))}}};t.default=l},"8c74":function(e,t,n){"use strict";var a;n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return a}));var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",{staticClass:"uni-container"},[n("avue-crud",{ref:"crud",attrs:{permission:e.permissionList,page:e.page,option:e.option,"table-loading":e.loading,data:e.data},on:{"row-del":function(t){arguments[0]=t=e.$handleEvent(t),e.rowDel.apply(void 0,arguments)},"row-update":function(t){arguments[0]=t=e.$handleEvent(t),e.rowUpdate.apply(void 0,arguments)},"row-save":function(t){arguments[0]=t=e.$handleEvent(t),e.rowSave.apply(void 0,arguments)},"search-change":function(t){arguments[0]=t=e.$handleEvent(t),e.searchChange.apply(void 0,arguments)},"search-reset":function(t){arguments[0]=t=e.$handleEvent(t),e.searchReset.apply(void 0,arguments)},"current-change":function(t){arguments[0]=t=e.$handleEvent(t),e.currentChange.apply(void 0,arguments)},"size-change":function(t){arguments[0]=t=e.$handleEvent(t),e.sizeChange.apply(void 0,arguments)},"selection-change":function(t){arguments[0]=t=e.$handleEvent(t),e.selectionChange.apply(void 0,arguments)},"on-load":function(t){arguments[0]=t=e.$handleEvent(t),e.loadData.apply(void 0,arguments)}},scopedSlots:e._u([{key:"create_date",fn:function(e){return[n("uniDateformate",{attrs:{date:e.row.create_date}})]}}]),model:{value:e.form,callback:function(t){e.form=t},expression:"form"}})],1)},i=[]},"8db5":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.remove=t.update=t.add=t.getList=void 0;var a=n("65a6"),r=function(e){return(0,a.request)("system/permissionTemplate/list",e)};t.getList=r;var i=function(e){return(0,a.request)("system/permissionTemplate/add",e)};t.add=i;var s=function(e){return(0,a.request)("system/permissionTemplate/update",e)};t.update=s;var o=function(e){return(0,a.request)("system/permissionTemplate/remove",e)};t.remove=o},9308:function(e,t,n){"use strict";n.r(t);var a=n("84a9"),r=n.n(a);for(var i in a)"default"!==i&&function(e){n.d(t,e,(function(){return a[e]}))}(i);t["default"]=r.a},9490:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.tree=t.remove=t.update=t.add=t.getList=void 0;var a=n("65a6"),r=function(e){return(0,a.request)("system/tenant/list",e)};t.getList=r;var i=function(e){return(0,a.request)("system/tenant/add",e)};t.add=i;var s=function(e){return(0,a.request)("system/tenant/update",e)};t.update=s;var o=function(e){return(0,a.request)("system/tenant/remove",e)};t.remove=o;var u=function(e){return(0,a.request)("system/tenant/tree",e)};t.tree=u},aa62:function(e,t,n){"use strict";n.r(t);var a=n("4494"),r=n.n(a);for(var i in a)"default"!==i&&function(e){n.d(t,e,(function(){return a[e]}))}(i);t["default"]=r.a},d0b5:function(e,t,n){"use strict";n.r(t);var a=n("8c74"),r=n("9308");for(var i in r)"default"!==i&&function(e){n.d(t,e,(function(){return r[e]}))}(i);var s,o=n("f0c5"),u=Object(o["a"])(r["default"],a["b"],a["c"],!1,null,"37c0cf0c",null,!1,a["a"],s);t["default"]=u.exports},dac0:function(e,t,n){"use strict";var a;n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return a}));var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-text",[e._v(e._s(e.dateShow))])},i=[]},e6a2:function(e,t,n){"use strict";n.r(t);var a=n("dac0"),r=n("aa62");for(var i in r)"default"!==i&&function(e){n.d(t,e,(function(){return r[e]}))}(i);var s,o=n("f0c5"),u=Object(o["a"])(r["default"],a["b"],a["c"],!1,null,"808c1684",null,!1,a["a"],s);t["default"]=u.exports}}]);