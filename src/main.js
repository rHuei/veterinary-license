import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'      // 在這裡載入 Bootstrap 的 JavaScript 檔

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

new Vue({
  render: h => h(App),
}).$mount('#app')
