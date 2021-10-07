import {
  EVENTS_TRANSACTION,
  EVENTS_VERSION_SET,
  EVENTS_TRADE_ADD,
  EVENTS_INFO_ADD,
  EVENTS_ERROR_ADD
} from '@/store/actions/events'
import Vue from 'vue'

const state = {
  data: {
    backendVersion: 'unknown',
    trades: {},
    infos: {},
    errors: {}
  }
}

const getters = {
  backendVersion: state => state.data.backendVersion,
  trades: state => Object.values(state.data.trades),
  infos: state => Object.values(state.data.infos),
  info: state => (symbol) => state.data.infos[symbol],
  errors: state => Object.values(state.data.errors),
  error: state => (symbol) => state.data.errors[symbol]
}

const actions = {
}

const mutations = {
  [EVENTS_TRANSACTION]: (state, data) => {
    state.data = data
  },
  [EVENTS_VERSION_SET]: (state, version) => {
    state.data.backendVersion = version
  },
  [EVENTS_TRADE_ADD]: (state, trade) => {
    Vue.set(state.data.trades, trade.pk, trade)
  },
  [EVENTS_INFO_ADD]: (state, info) => {
    Vue.set(state.data.infos, info.pk, info)
  },
  [EVENTS_ERROR_ADD]: (state, error) => {
    Vue.set(state.data.errors, error.pk, error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
