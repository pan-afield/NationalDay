import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'lib-flexible/flexible'
import 'vant/lib/index.css';
import scroll from 'vue-seamless-scroll'
import { Area } from 'vant'
import '@vant/touch-emulator'
import Tips from './components/Tips/Tips'
import service from './request/axios'

Vue.config.productionTip = false
Vue.prototype.$axios = service
Vue.use(Area)
Vue.use(scroll)
Vue.use(Tips);
// "test": "set NODE_ENV=test&& set VUE_APP_BASE_API=//f8.lexun.com/webapi&& vue-cli-service build",
if(process.env.NODE_ENV == "production"){
  window.console.log = () => {}
}
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
