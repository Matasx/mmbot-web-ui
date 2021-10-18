import 'mutationobserver-shim'
import 'es6-promise/auto'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/vuex'
import './plugins/fontAwesome'
import './plugins/highcharts'
import App from './App.vue'
import router from './router'
import store from './store'
import { setupStream } from './eventsource'

Vue.config.productionTip = false
Vue.prototype.$serviceUrl = 'https://www.mmbot.trade/live/'
// Vue.prototype.$serviceUrl = 'https://mmbot.matatko.cz/'

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    setupStream()
  }
}).$mount('#app')
