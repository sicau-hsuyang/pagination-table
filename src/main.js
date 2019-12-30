import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import PaginationTable from './components/BaseTable'
Vue.config.productionTip = false
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(PaginationTable)
new Vue({
  render: h => h(App)
}).$mount('#app')
