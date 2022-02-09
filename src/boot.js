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

start()

async function start () {
  console.debug('Initializing store ...')
  await store.restored
  console.debug('Store was restored')

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
