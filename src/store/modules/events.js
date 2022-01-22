import {
  EVENTS_TRANSACTION,
  EVENTS_VERSION_SET,
  EVENTS_TRADE_ADD,
  EVENTS_TRADE_RECALCULATE,
  EVENTS_INFO_ADD,
  EVENTS_ERROR_ADD,
  EVENTS_ORDER_ADD,
  EVENTS_MISC_ADD,
  EVENTS_PRICE_ADD,
  EVENTS_LOG_ADD,
  EVENTS_PERFORMANCE_SET,
  EVENTS_CONFIG_SET,
  EVENTS_LAST_EVENT_TIME_SET,
  EVENTS_FIRST_TRADE_SET,
  EVENTS_LAST_TRADE_SET
} from '@/store/actions/events'
import Vue from 'vue'
import moment from 'moment'

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
    price: {},
    logs: []
  },
  computed: {
    tradesAsc: {},
    tradesDesc: {},
    firstTradeGlobal: null,
    lastTradeGlobal: null,
    enabled: {}
  },
  lastEventTime: 0
}

const getters = {
  backendVersion: state => state.data.backendVersion,
  trades: state => (symbol) => state.computed.tradesDesc[symbol] ?? [],
  tradesRev: state => (symbol) => state.computed.tradesAsc[symbol] ?? [],
  tradesFlat: state => {
    console.debug('compute: tradesFlat')
    return Object.values(state.data.trades ?? {}).flatMap(list => Object.values(list)).sort(descTime)
  },
  dailyAggregations: state => (symbol) => {
    console.debug('compute: dailyAggregations ' + symbol)
    const groups = Object.entries(groupBy(Object.values(state.data.trades[symbol] ?? {}), t => moment(t.time).startOf('day').valueOf()))
    return groups.map(([_, list]) => {
      const rplDiff = list.reduce((acc, t) => acc + t.rplDiff, 0)
      return { time: moment(list[0].time).startOf('day').valueOf(), rplDiff: rplDiff, agg: true }
    }).sort((a, b) => a.time - b.time)
  },
  enabledTradesFlat: state => {
    console.debug('compute: enabledTradesFlat')
    return Object.entries(state.data.trades ?? {}).filter(([key, _]) => state.computed.enabled[key]).flatMap(([_, list]) => Object.values(list)).sort((a, b) => a.time - b.time)
  },
  firstTradeGlobal: (_, getters) => {
    const sorted = getters.enabledTradesFlat
    return sorted.length > 0 ? sorted[0] : null
  },
  lastTradeGlobal: (_, getters) => {
    const sorted = getters.enabledTradesFlat
    return sorted.length > 0 ? sorted[sorted.length - 1] : null
  },
  firstTrade: (_, getters) => (symbol) => {
    const sorted = getters.trades(symbol)
    return sorted.length > 0 ? sorted[0] : null
  },
  lastTrade: (_, getters) => (symbol) => {
    const sorted = getters.tradesRev(symbol)
    return sorted.length > 0 ? sorted[0] : null
  },
  infos: state => Object.values(state.data.infos).sort((a, b) => a.order === b.order ? a.title.localeCompare(b.title) : a.order - b.order),
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
      .filter(o => o.price)
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
  miscEnabled: (_, getters) => (symbol) => getters.misc(symbol).en,
  price: state => (symbol) => state.data.price[symbol],
  performance: state => state.data.performance,
  config: state => state.data.config,
  lastEventTime: state => state.lastEventTime,
  logs: state => state.data.logs
}

const groupBy = function (xs, selector) {
  return xs.reduce((rv, x) => {
    const key = selector(x);
    (rv[key] = rv[key] || []).push(x)
    return rv
  }, {})
}

const setNested = function (collection, key1, key2, value) {
  if (key1 in collection) {
    const nested = collection[key1]
    const replace = !!nested[key2]
    Vue.set(nested, key2, value)
    return replace
  } else {
    Vue.set(collection, key1, { [key2]: value })
    return false
  }
}

const updateDiffAll = function (trades) {
  let lastTrade
  Object.values(trades).sort(descTime).forEach(trade => {
    updateDiff(lastTrade, trade)
    lastTrade = trade
  })
}

const updateDiff = function (l, r) {
  if (l === undefined) return
  r.plDiff = safeDiff(r.pl, l.pl)
  r.rplDiff = safeDiff(r.rpl, l.rpl)
}

const safeDiff = function (a, b) {
  if (a === undefined) return b
  if (b === undefined) return a
  return a - b
}

const descTime = function (a, b) {
  return a.time - b.time
}

const ascTime = function (a, b) {
  return b.time - a.time
}

const actions = {
  addTrade ({ commit, getters }, trade) {
    const firstTradeGlobal = getters.firstTradeGlobal
    if (!firstTradeGlobal || trade.time < firstTradeGlobal.time) {
      const misc = getters.misc(trade.symbol)
      if (misc && misc.en) {
        commit(EVENTS_FIRST_TRADE_SET, trade)
      }
    }

    const lastTradeGlobal = getters.lastTradeGlobal
    if (!lastTradeGlobal || trade.time > lastTradeGlobal.time) {
      const misc = getters.misc(trade.symbol)
      if (misc && misc.en) {
        commit(EVENTS_LAST_TRADE_SET, trade)
      }
    }

    // const lastTrade = getters.lastTrade(trade.symbol)
    // if (lastTrade && lastTrade.time < trade.time) {
    //   updateDiff(lastTrade, trade)
    //   commit(EVENTS_TRADE_ADD, trade)
    // } else {
    //   commit(EVENTS_TRADE_ADD, trade)
    //   commit(EVENTS_TRADE_RECALCULATE, trade.symbol)
    // }
  }
}

const updateComputed = function (state, symbol, trades) {
  // todo: recalculate all stats
  const asc = Object.values(trades ?? {}).sort(ascTime)
  Vue.set(state.computed.tradesAsc, symbol, asc)

  const desc = Object.values(trades ?? {}).sort(descTime)
  Vue.set(state.computed.tradesDesc, symbol, desc)
}

const mutations = {
  [EVENTS_FIRST_TRADE_SET]: (state, trade) => {
    console.log('set first')
    state.computed.firstTradeGlobal = trade
  },
  [EVENTS_LAST_TRADE_SET]: (state, trade) => {
    console.log('set last')
    state.computed.lastTradeGlobal = trade
  },
  [EVENTS_TRANSACTION]: (state, data) => {
    state.computed.tradesAsc = {}
    state.computed.tradesDesc = {}
    state.computed.firstTradeGlobal = null
    state.computed.lastTradeGlobal = null

    var en = {}
    Object.entries(data.misc).forEach(([symbol, misc]) => {
      en[symbol] = misc.en
    })
    state.computed.enabled = en

    Object.entries(data.trades).forEach(([symbol, trades]) => {
      updateDiffAll(trades)
      updateComputed(state, symbol, trades)
    })
    state.data = data
  },
  [EVENTS_TRADE_ADD]: (state, trade) => {
    if (setNested(state.data.trades, trade.symbol, trade.id, trade)) {
      updateComputed(state, trade.symbol, state.data.trades[trade.symbol])
    } else {
      var tradesAsc = state.computed.tradesAsc[trade.symbol]
      if (!tradesAsc) Vue.set(state.computed.tradesAsc, trade.symbol, tradesAsc = [])
      tradesAsc.addSorted(trade, descTime)

      var tradesDesc = state.computed.tradesDesc[trade.symbol]
      if (!tradesDesc) Vue.set(state.computed.tradesDesc, trade.symbol, tradesDesc = [])
      tradesDesc.addSorted(trade, ascTime)
    }
  },
  [EVENTS_VERSION_SET]: (state, version) => {
    state.data.backendVersion = version
  },
  [EVENTS_TRADE_RECALCULATE]: (state, symbol) => {
    updateDiffAll(state.data.trades[symbol])
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
    if (misc.en !== state.computed[misc.symbol]) {
      Vue.set(state.computed.enabled, misc.symbol, misc.en)
    }
  },
  [EVENTS_PRICE_ADD]: (state, price) => {
    Vue.set(state.data.price, price.symbol, price)
  },
  [EVENTS_LOG_ADD]: (state, log) => {
    state.data.logs.push(log)
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
  actions,
  mutations
}
