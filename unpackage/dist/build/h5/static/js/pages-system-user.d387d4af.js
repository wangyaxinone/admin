(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-system-user"],{"1ec6":function(e,t,a){"use strict";a.r(t);var n=a("c28f"),r=a.n(n);for(var i in n)"default"!==i&&function(e){a.d(t,e,(function(){return n[e]}))}(i);t["default"]=r.a},"5d9f":function(e,t,a){"use strict";var n;a.d(t,"b",(function(){return r})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){return n}));var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",[e._t("default",null,{options:e.options,data:e.dataList,pagination:e.paginationInternal,loading:e.loading,error:e.errorMessage})],2)},i=[]},"6ddb":function(e,t,a){"use strict";a.r(t);var n=a("d17a"),r=a.n(n);for(var i in n)"default"!==i&&function(e){a.d(t,e,(function(){return n[e]}))}(i);t["default"]=r.a},"7b04":function(e,t,a){"use strict";var n;a.d(t,"b",(function(){return r})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){return n}));var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-text",[e._v(e._s(e.dateShow))])},i=[]},"95b5":function(e,t,a){"use strict";a.r(t);var n=a("7b04"),r=a("a6a3");for(var i in r)"default"!==i&&function(e){a.d(t,e,(function(){return r[e]}))}(i);var o,u=a("f0c5"),s=Object(u["a"])(r["default"],n["b"],n["c"],!1,null,"808c1684",null,!1,n["a"],o);t["default"]=s.exports},a6a3:function(e,t,a){"use strict";a.r(t);var n=a("a86a"),r=a.n(n);for(var i in n)"default"!==i&&function(e){a.d(t,e,(function(){return n[e]}))}(i);t["default"]=r.a},a83f:function(e,t,a){"use strict";a.r(t);var n=a("5d9f"),r=a("1ec6");for(var i in r)"default"!==i&&function(e){a.d(t,e,(function(){return r[e]}))}(i);var o,u=a("f0c5"),s=Object(u["a"])(r["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],o);t["default"]=s.exports},a86a:function(e,t,a){"use strict";a("a9e3"),a("e25e"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a("9ccf"),r={name:"uniDateformat",props:{date:{type:[Object,String,Number],default:function(){return Date.now()}},locale:{type:String,default:"zh"},threshold:{type:Array,default:function(){return[0,0]}},format:{type:String,default:"yyyy/MM/dd hh:mm:ss"},refreshRate:{type:[Number,String],default:0}},data:function(){return{refreshMark:0}},computed:{dateShow:function(){return this.refreshMark,(0,n.friendlyDate)(this.date,{locale:this.locale,threshold:this.threshold,format:this.format})}},watch:{refreshRate:{handler:function(){this.setAutoRefresh()},immediate:!0}},methods:{refresh:function(){this.refreshMark++},setAutoRefresh:function(){var e=this;clearInterval(this.refreshInterval),this.refreshRate&&(this.refreshInterval=setInterval((function(){e.refresh()}),parseInt(this.refreshRate)))}}};t.default=r},c28f:function(e,t,a){"use strict";(function(e){var n=a("4ea4");a("4160"),a("a434"),a("a9e3"),a("b64b"),a("ac1f"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("2909")),i=e.database(),o=(i.command,{load:"load",error:"error"}),u={add:"add",replace:"replace"},s=["collection","action","field","pageCurrent","pageSize","getcount","orderby","where"],l={props:{prtLoad:{type:Function},options:{type:[Object,Array],default:function(){return{}}},collection:{type:String,default:""},action:{type:String,default:""},field:{type:String,default:""},pageData:{type:String,default:"add"},pageCurrent:{type:Number,default:1},pageSize:{type:Number,default:10},getcount:{type:[Boolean,String],default:!1},orderby:{type:String,default:""},where:{type:[String,Object],default:""},getone:{type:[Boolean,String],default:!1},manual:{type:Boolean,default:!1}},data:function(){return{loading:!1,dataList:[],paginationInternal:{current:this.pageCurrent,size:this.pageSize,total:0},errorMessage:""}},created:function(){var e=this;this._isEnded=!1,this.$watch((function(){var t=[];return s.forEach((function(a){t.push(e[a])})),t}),(function(t,a){e.clear(),e.reset(),e._execLoadData()})),this.manual||this.loadData()},beforeDestroy:function(){},methods:{loadData:function(){var e=null;if(1===arguments.length){var t=arguments[0];"function"===typeof t?e=t:t.clear&&(this.clear(),this.reset()),void 0!==t.current&&(this.paginationInternal.current=t.current)}else 2===arguments.length&&(e=arguments[1]);this._execLoadData(e)},loadMore:function(){this._isEnded||this._execLoadData()},clear:function(){this._isEnded=!1,this.dataList=[]},reset:function(){this.paginationInternal.current=1},_execLoadData:function(e){var t=this;this.loading||(this.loading=!0,this.errorMessage="",this._getExec().then((function(a){t.loading=!1;var n=a.result,i=n.data,s=n.count;if(t.prtLoad)i=t.prtLoad(i);if(t._isEnded=i.length<t.pageSize,e&&e(i,t._isEnded),t._dispatchEvent(o.load,i),t.getone)t.dataList=i.length?i[0]:void 0;else if(t.pageData===u.add){var l;(l=t.dataList).push.apply(l,(0,r.default)(i)),t.dataList.length&&t.paginationInternal.current++}else t.pageData===u.replace&&(t.dataList=i,t.paginationInternal.total=s)})).catch((function(a){t.loading=!1,t.errorMessage=a,e&&e(),t.$emit(o.error,a)})))},_getExec:function(){var e=i;this.action&&(e=e.action(this.action)),e=i.collection(this.collection),this.where&&Object.keys(this.where).length&&(e=e.where(this.where)),this.field&&(e=e.field(this.field)),this.orderby&&(e=e.orderBy(this.orderby));var t=this.paginationInternal,a=t.current,n=t.size;return e=e.skip(n*(a-1)).limit(n).get({getCount:this.getcount}),e},_dispatchEvent:function(e,t){this._changeDataFunction?this._changeDataFunction(t,this._isEnded):this.$emit(e,t,this._isEnded)}}};t.default=l}).call(this,a("a9ff")["default"])},d17a:function(e,t,a){"use strict";(function(e){var n=a("4ea4");a("a15b"),a("d81d"),a("498a"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a("f513")),i=n(a("95b5")),o=(e.database(),"uni-id-users"),u="create_date desc",s=["permission_id","permission_name"],l={components:{uniDateformate:i.default},data:function(){return{query:"",where:"",orderby:u,collectionName:o,options:{pageSize:r.default.pages.pageSize,pageCurrent:r.default.pages.pageCurrent},form:{},params:{},option:{height:"auto",calcHeight:80,searchShow:!0,searchMenuSpan:6,rowKey:"_id",tip:!1,tree:!0,border:!0,index:!0,selection:!0,viewBtn:!0,column:[{label:"用户名称",prop:"username",search:!0,span:12,rules:[{required:!0,message:"请输入用户名称",trigger:"blur"}]},{label:"密码",prop:"password",span:12,hide:!0,editDisplay:!1,viewDisplay:!1,type:"password",rules:[{required:!0,message:"请输入密码",trigger:"blur"}]},{label:"用户昵称",prop:"nickname",search:!0,span:12},{label:"用户性别",prop:"gender",span:12},{label:"所属门店",prop:"tenantId",type:"tree",span:12,dicData:[],props:{label:"tenantName",value:"_id"},search:!1,rules:[{required:!0,message:"请输入所属租户",trigger:"change"}]},{label:"用户角色",prop:"role",span:12,rules:[{required:!0,message:"请输入用户角色",trigger:"blur"}]},{label:"用户状态",prop:"status",span:12,rules:[{required:!0,message:"请输入用户状态",trigger:"blur"}]},{label:"手机号码",prop:"mobile",span:12},{label:"最后登录时间",prop:"last_login_date",slot:!0,width:140,span:12,display:!1},{label:"最后登录时 IP 地址",prop:"last_login_ip",width:120,span:12,display:!1}]},data:[]}},methods:{clientdbload:function(e){e&&e.length},getWhere:function(){var e=this.query.trim();if(!e)return"";var t="/".concat(e,"/i");return s.map((function(e){return t+".test("+e+")"})).join(" || ")},search:function(){var e=this.getWhere(),t=e===this.where;this.where=e,t&&this.loadData()},rowDel:function(){},rowUpdate:function(){},rowSave:function(){},searchReset:function(){this.where="",this.params={},this.loadData()},searchChange:function(e,t){this.params=e,this.loadData(),t()},selectionChange:function(){},currentChange:function(e){this.options.pageCurrent=e},sizeChange:function(e){this.options.pageSize=e},loadData:function(){var e=this,t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];this.$nextTick((function(){e.$refs.dataQuery.loadData({clear:t})}))}}};t.default=l}).call(this,a("a9ff")["default"])},e49a:function(e,t,a){"use strict";a.r(t);var n=a("f235"),r=a("6ddb");for(var i in r)"default"!==i&&function(e){a.d(t,e,(function(){return r[e]}))}(i);var o,u=a("f0c5"),s=Object(u["a"])(r["default"],n["b"],n["c"],!1,null,"5f63ad68",null,!1,n["a"],o);t["default"]=s.exports},f235:function(e,t,a){"use strict";a.d(t,"b",(function(){return r})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){return n}));var n={uniClientdb:a("a83f").default},r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",[a("v-uni-view",{staticClass:"uni-container"},[a("uni-clientdb",{ref:"dataQuery",attrs:{collection:e.collectionName,options:e.options,where:e.where,"page-data":"replace",orderby:e.orderby,getcount:!0,"page-size":e.options.pageSize,"page-current":e.options.pageCurrent},on:{load:function(t){arguments[0]=t=e.$handleEvent(t),e.clientdbload.apply(void 0,arguments)}},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.data,r=t.loading,i=t.pagination;return[a("avue-crud",{ref:"crud",attrs:{option:e.option,page:i,"table-loading":r,data:n},on:{"row-del":function(t){arguments[0]=t=e.$handleEvent(t),e.rowDel.apply(void 0,arguments)},"row-update":function(t){arguments[0]=t=e.$handleEvent(t),e.rowUpdate.apply(void 0,arguments)},"row-save":function(t){arguments[0]=t=e.$handleEvent(t),e.rowSave.apply(void 0,arguments)},"search-change":function(t){arguments[0]=t=e.$handleEvent(t),e.searchChange.apply(void 0,arguments)},"search-reset":function(t){arguments[0]=t=e.$handleEvent(t),e.searchReset.apply(void 0,arguments)},"selection-change":function(t){arguments[0]=t=e.$handleEvent(t),e.selectionChange.apply(void 0,arguments)},"current-change":function(t){arguments[0]=t=e.$handleEvent(t),e.currentChange.apply(void 0,arguments)},"size-change":function(t){arguments[0]=t=e.$handleEvent(t),e.sizeChange.apply(void 0,arguments)},"on-load":function(t){arguments[0]=t=e.$handleEvent(t),e.loadData.apply(void 0,arguments)}},scopedSlots:e._u([{key:"last_login_date",fn:function(e){return[a("uni-dateformate",{attrs:{date:e.row.last_login_date}})]}}],null,!0),model:{value:e.form,callback:function(t){e.form=t},expression:"form"}})]}}])})],1)],1)},i=[]}}]);