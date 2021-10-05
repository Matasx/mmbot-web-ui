import {
  EVENTS_TRADES_ADD,
  EVENTS_TRADES_SET,
  EVENTS_INFOS_ADD,
  EVENTS_INFOS_SET
} from '../actions/events'

const state = {
  trades: [],
  infos: {}
}

const getters = {
  trades: state => state.trades,
  infos: state => Object.keys(state.infos).map(key => state.infos[key]),
  info: state => (symbol) => state.infos[symbol]
}

const actions = {
}

const mutations = {
  [EVENTS_TRADES_ADD]: (state, trade) => {
    state.trades.push(trade)
  },
  [EVENTS_TRADES_SET]: (state, trades) => {
    state.trades = trades
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
