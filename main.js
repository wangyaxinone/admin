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

import GoEasy from 'goeasy';
Vue.prototype.$goeasy = GoEasy.getInstance({
    host: 'hangzhou.goeasy.io',
    appkey: 'BC-28371c5513814c3dbad7fbd510235716'
});
Vue.prototype.$goeasy.connect({
    onSuccess: function () {  //连接成功
        console.log("GoEasy connect successfully.") //连接成功
    },
    onFailed: function (error) { //连接失败
        console.log("Failed to connect GoEasy, code:"+error.code+ ",error:"+error.content);
    },
    onProgress:function(attempts) { //连接或自动重连中
        console.log("GoEasy is connecting", attempts);    
    }
});

App.mpType = 'app'
Vue.component('selectUser', selectUser)
const app = new Vue({
    store,
    ...App
})
app.$mount()
