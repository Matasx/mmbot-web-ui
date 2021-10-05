import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistance from 'vuex-persist'
import auth from './modules/auth'
import events from './modules/events'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const vuexLocal = new VuexPersistance({
  storage: window.localStorage
})

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  modules: {
    auth,
    events
  },
  strict: debug
})
