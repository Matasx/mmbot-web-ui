import axios from 'axios'
import Vue from 'vue'

Vue.config.productionTip = false
// Vue.config.performance = true

start()

async function start () {
  try {
    const config = (await axios.get('config.json')).data

    axios.defaults.withCredentials = !!config.withCredentials
    axios.defaults.baseURL = config.url

    Vue.prototype.$withCredentials = !!config.withCredentials
    Vue.prototype.$serviceUrl = config.url
    Vue.prototype.$storageKey = config.storage

    await import('@/boot')
  } catch (e) {
    console.error('Cannot load application!')
    console.error(e)
  }
}
