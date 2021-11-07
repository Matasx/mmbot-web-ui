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
  trades: state => (symbol) => [...Object.values(state.data.trades[symbol] ?? [])].sort((a, b) => a.time - b.time),
  tradesRev: state => (symbol) => [...Object.values(state.data.trades[symbol] ?? [])].sort((a, b) => b.time - a.time),
  tradesFlat: state => [...Object.values(state.data.trades).flatMap(list => Object.values(list))].sort((a, b) => a.time - b.time),
  firstTradeGlobal: (_, getters) => {
    const sorted = getters.tradesFlat
    return sorted.length > 0 ? sorted[0] : null
  },
  lastTrade: (_, getters) => (symbol) => {
    const sorted = getters.tradesRev(symbol)
    return sorted.length > 0 ? sorted[0] : null
  },
  infos: state => Object.values(state.data.infos),
  info: state => (symbol) => state.data.infos[symbol],
  errors: state => Object.values(state.data.errors),
  error: state => (symbol) => state.data.errors[symbol],
  orders: (_, getters) => (symbol) => Object.values(getters.ordersMap(symbol)),
  ordersMap: state => (symbol) => state.data.orders[symbol] ?? {},
  ordersExt: (_, getters) => (symbol) => {
    const misc = getters.misc(symbol)
    const info = getters.info(symbol)
    if (!info || !misc) return []

    const last = getters.lastTrade(symbol) ?? {
      pl: 0,
      pos: 0,
      norm: 0,
      p0: 0
    }

    // https://github.com/ondra-novak/mmbot/blob/31b94b1d5b09ab778048e86f93c5938faf3ec343/www/res/code.js#L802-L816
    return getters.orders(symbol)
      .map(o => {
        const gain = ((info.inverted ? 1.0 / o.price : o.price) - (info.inverted ? 1.0 / last.price : last.price)) * (info.inverted ? -1 : 1) * last.pos
        const norm = o.dir < 0 ? misc.curNormSell : misc.curNormBuy
        return ({
          dir: o.dir,
          dirStr: o.dirStr,
          symbol: o.symbol,
          price: o.price,
          size: o.size,
          pl: last.pl + gain,
          pos: last.pos + o.size,
          norm: last.norm + norm,
          achg: o.size,
          dp0: o.price - last.p0
        })
      })
  },
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
