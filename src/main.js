import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import Table from './components/BaseTable'
Vue.config.productionTip = false
import 'element-ui/lib/theme-chalk/index.css';

import http from './api'

Vue.prototype.$http = http;

Vue.use(ElementUI);
Vue.use(Table, {
  name: "BaseTable"
})
new Vue({
  render: h => h(App)
}).$mount('#app')
