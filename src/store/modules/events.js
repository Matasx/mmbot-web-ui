import {
  EVENTS_TRANSACTION,
  EVENTS_VERSION_SET,
  EVENTS_TRADE_ADD,
  EVENTS_INFO_ADD,
  EVENTS_ERROR_ADD,
  EVENTS_ORDER_ADD,
  EVENTS_MISC_ADD,
  EVENTS_PRICE_ADD,
  EVENTS_PERFORMANCE_SET,
  EVENTS_CONFIG_SET,
  EVENTS_LAST_EVENT_TIME_SET
} from '@/store/actions/events'
import Vue from 'vue'

const state = {
  data: {
    backendVersion: 'unknown',
    trades: {},
    infos: {},
    errors: {},
    orders: {},
    misc: {},
    performance: {},
    config: {},
    price: {}
  },
  lastEventTime: 0
}

const getters = {
  backendVersion: state => state.data.backendVersion,
  trades: state => (symbol) => Object.values(state.data.trades[symbol] ?? []),
  tradesFlat: state => Object.values(state.data.trades).flatMap(list => Object.values(list)),
  infos: state => Object.values(state.data.infos),
  info: state => (symbol) => state.data.infos[symbol],
  errors: state => Object.values(state.data.errors),
  error: state => (symbol) => state.data.errors[symbol],
  orders: state => (symbol) => Object.values(state.data.orders[symbol] ?? {}),
  ordersMap: state => (symbol) => state.data.orders[symbol] ?? {},
  misc: state => (symbol) => state.data.misc[symbol],
  price: state => (symbol) => state.data.price[symbol],
  performance: state => state.data.performance,
  config: state => state.data.config,
  lastEventTime: state => state.lastEventTime
}

const setNested = function (collection, key1, key2, value) {
  if (key1 in collection) {
    Vue.set(collection[key1], key2, value)
  } else {
    Vue.set(collection, key1, { [key2]: value })
  }
}

const mutations = {
  [EVENTS_TRANSACTION]: (state, data) => {
    state.data = data
  },
  [EVENTS_VERSION_SET]: (state, version) => {
    state.data.backendVersion = version
  },
  [EVENTS_TRADE_ADD]: (state, trade) => {
    setNested(state.data.trades, trade.symbol, trade.id, trade)
  },
  [EVENTS_INFO_ADD]: (state, info) => {
    Vue.set(state.data.infos, info.symbol, info)
  },
  [EVENTS_ERROR_ADD]: (state, error) => {
    Vue.set(state.data.errors, error.symbol, error)
  },
  [EVENTS_ORDER_ADD]: (state, order) => {
    setNested(state.data.orders, order.symbol, order.dirStr, order)
  },
  [EVENTS_MISC_ADD]: (state, misc) => {
    Vue.set(state.data.misc, misc.symbol, misc)
  },
  [EVENTS_PRICE_ADD]: (state, price) => {
    Vue.set(state.data.price, price.symbol, price)
  },
  [EVENTS_PERFORMANCE_SET]: (state, performance) => {
    state.data.performance = performance
  },
  [EVENTS_CONFIG_SET]: (state, config) => {
    state.data.config = config
  },
  [EVENTS_LAST_EVENT_TIME_SET]: (state, time) => {
    state.lastEventTime = time
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
