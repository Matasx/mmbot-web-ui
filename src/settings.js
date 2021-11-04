import Vue from 'vue'

const configs = {
  live: {
    serviceUrl: 'https://www.mmbot.trade/live/',
    storageKey: 'vuex'
  },
  matatko: {
    serviceUrl: 'https://mmbot.matatko.cz/',
    storageKey: 'matatko'
  }
}

const active = configs.live

Vue.prototype.$serviceUrl = active.serviceUrl
Vue.prototype.$storageKey = active.storageKey
