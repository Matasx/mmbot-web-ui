import {
  EVENTS_TRANSACTION,
  EVENTS_VERSION_SET,
  EVENTS_TRADES_ADD,
  EVENTS_INFOS_ADD
} from '@/store/actions/events'

const state = {
  data: {
    backendVersion: 'unknown',
    trades: {},
    infos: {}
  }
}

const getters = {
  backendVersion: state => state.data.backendVersion,
  trades: state => Object.values(state.data.trades),
  infos: state => Object.values(state.data.infos),
  info: state => (symbol) => state.data.infos[symbol]
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
  [EVENTS_TRADES_ADD]: (state, trade) => {
    state.data.trades[trade.pk] = trade
  },
  [EVENTS_INFOS_ADD]: (state, info) => {
    state.data.infos[info.pk] = info
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
