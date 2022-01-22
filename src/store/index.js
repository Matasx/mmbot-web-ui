import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistance from 'vuex-persist'
import localforage from 'localforage'
import auth from './modules/auth'
import events from './modules/events'
import settings from './modules/settings'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistance({
  storage: localforage,
  asyncStorage: true,
  key: Vue.prototype.$storageKey
})

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  modules: {
    auth,
    events,
    settings
  },
  strict: debug
})
