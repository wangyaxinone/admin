import Vue from 'vue'
import App from './App'
import store from './store'
import plugin from './js_sdk/uni-admin/plugin'
// import Avue from './js_sdk/avue/avue.min.js'
// import './js_sdk/avue/index.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
Vue.use(Avue);
Vue.use(ElementUI);
// Vue.use(Avue);
Vue.use(plugin)

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
