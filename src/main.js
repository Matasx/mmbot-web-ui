import '@/settings'
import 'mutationobserver-shim'
import 'es6-promise/auto'
import Vue from 'vue'
import '@/plugins/bootstrap-vue'
import '@/plugins/vuex'
import '@/plugins/fontAwesome'
import '@/plugins/highcharts'
import '@/plugins/cryptojs'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { setupStream } from '@/eventsource'
import '@/registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    setupStream()
  }
}).$mount('#app')
