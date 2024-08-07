import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import echarts from "echarts"
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import { getRequest } from './utils/api';
import { postRequest } from "@/utils/api";
import { putRequest } from "@/utils/api";
import { deleteRequest } from "@/utils/api";
import AFTableColumn from 'af-table-column'
import htmlToPdf from './utils/htmlToPdf.js'
import htmlToPdf1 from './utils/htmlToPdf1.js'
import htmlToPdf2 from './utils/htmlToPdf2.js'
import htmlToPdf3 from './utils/htmlToPdf3.js'

Vue.use(htmlToPdf3)
Vue.use(htmlToPdf2)
Vue.use(htmlToPdf1)
Vue.use(htmlToPdf)
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.prototype.postRequest = postRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.deleteRequest = deleteRequest

Vue.use(ElementUI)
Vue.use(AFTableColumn)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
