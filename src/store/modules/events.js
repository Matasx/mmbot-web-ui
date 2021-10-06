import {
  EVENTS_VERSION_SET,
  EVENTS_TRADES_ADD,
  EVENTS_TRADES_SET,
  EVENTS_INFOS_ADD,
  EVENTS_INFOS_SET
} from '../actions/events'

const state = {
  backendVersion: 'unknown',
  trades: {},
  infos: {}
}

const getters = {
  backendVersion: state => state.backendVersion,
  trades: state => Object.values(state.trades),
  infos: state => Object.values(state.infos),
  info: state => (symbol) => state.infos[symbol]
}

const actions = {
}

const mutations = {
  [EVENTS_VERSION_SET]: (state, version) => {
    state.backendVersion = version
  },
  [EVENTS_TRADES_ADD]: (state, trade) => {
    state.trades[trade.pk] = trade
  },
  [EVENTS_TRADES_SET]: (state, trades) => {
    const newTrades = { }
    trades.forEach(trade => {
      newTrades[trade.pk] = trade
    })
    state.trades = newTrades
  },
  [EVENTS_INFOS_ADD]: (state, info) => {
    state.infos[info.symbol] = info
  },
  [EVENTS_INFOS_SET]: (state, events) => {
    const newInfos = { }
    events.forEach(info => {
      newInfos[info.symbol] = info
    })
    state.infos = newInfos
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
