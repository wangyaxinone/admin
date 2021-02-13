import Vue from 'vue'
import App from './App'
import store from './store'
import plugin from './js_sdk/uni-admin/plugin'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import NP from 'number-precision';
import selectUser from "@/components/selectUser/selectUser.vue"
Vue.prototype.$NP = NP;
Vue.config.productionTip = false

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import AvueMap from 'avue-plugin-map'
Vue.use(Avue);
Vue.use(ElementUI);
Vue.use(AvueMap);
Vue.use(plugin)

import eventBus from '@/util/eventBus.js';
Vue.prototype.$eventBus = eventBus;




App.mpType = 'app'
Vue.component('selectUser', selectUser)
const app = new Vue({
    store,
    ...App
})
app.$mount()

Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}
