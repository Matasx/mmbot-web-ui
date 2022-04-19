import {
  EVENTS_TRANSACTION,
  EVENTS_BATCH
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
    enabled: {},
    lastTrade: {}
  }
}

const getters = {
  backendVersion: state => state.data.backendVersion,

  tradesCached: state => {
    console.debug('compute: tradesCached')
    return Object.entries(state.data.trades).reduce((map, [symbol, trades]) => {
      map[symbol] = Object.values(trades ?? {}).sort(ascTime)
      return map
    }, { })
  },
  trades: (_, getters) => (symbol) => getters.tradesCached[symbol] ?? [],

  tradesRevCached: state => {
    console.debug('compute: tradesRevCached')
    return Object.entries(state.data.trades).reduce((map, [symbol, trades]) => {
      map[symbol] = Object.values(trades ?? {}).sort(descTime)
      return map
    }, { })
  },
  tradesRev: (_, getters) => (symbol) => getters.tradesRevCached[symbol] ?? [],

  tradesFlat: state => {
    console.debug('compute: tradesFlat')
    return Object.values(state.data.trades ?? {}).flatMap(list => Object.values(list)).sort(ascTime)
  },

  hourlyTradesCached: (state, getters) => {
    console.debug('compute: hourlyTradesCached')
    return Object.entries(state.data.trades).reduce((map, [symbol, tr]) => {
      const trades = Object.values(tr ?? {})
      const agg = []
      map[symbol] = agg
      if (trades.length === 0) {
        return map
      }
      const last = moment(getters.lastTradeGlobal.time).startOf('hour').valueOf()
      let i = 0
      let current = null
      let next = trades[0]
      let nextTime = moment(next.time).startOf('hour').valueOf()
      for (let t = nextTime; t <= last; t += 3600000) {
        while ((!current || t >= nextTime) && i < trades.length) {
          current = next
          i++
          if (i < trades.length) {
            next = trades[i]
            nextTime = moment(next.time).startOf('hour').valueOf()
          }
        }
        agg.push({
          time: t,
          pl: current.pl
        })
      }
      return map
    }, { })
  },
  hourlyTrades: (_, getters) => (symbol) => getters.hourlyTradesCached[symbol] ?? [],

  dailyAggregationsCached: state => {
    console.debug('compute: dailyAggregationsCached')
    return Object.entries(state.data.trades).reduce((map, [symbol, trades]) => {
      const groups = Object.entries(groupBy(Object.values(trades ?? {}), t => moment(t.time).startOf('day').valueOf()))
      map[symbol] = groups.map(([_, list]) => {
        const rplDiff = list.reduce((acc, t) => acc + t.rplDiff, 0)
        return { time: moment(list[0].time).startOf('day').valueOf(), rplDiff: rplDiff, agg: true }
      }).sort((a, b) => a.time - b.time)
      return map
    }, { })
  },
  dailyAggregations: (_, getters) => (symbol) => getters.dailyAggregationsCached[symbol] ?? [],

  enabledTradesFlat: state => {
    console.debug('compute: enabledTradesFlat')
    return Object.entries(state.data.trades ?? {}).filter(([key, _]) => state.computed.enabled[key]).flatMap(([_, list]) => Object.values(list)).sort(ascTime)
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
  lastTrade: state => (symbol) => state.computed.lastTrade[symbol],
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
  stats: (_, getters) => (symbol) => {
    // const intervals = [
    //   ['h',3600],
    //   ['d',3600 * 24],
    //   ['w',3600 * 24 * 7],
    //   ['m',30 * 3600 * 24],
    //   ['y',365 * 3600 * 24]
    // ]

    const firstTradeOrDefault = getters.firstTrade(symbol) ?? {
      pl: 0,
      norm: 0
    }
    const lastTradeOrDefault = getters.lastTrade(symbol) ?? {
      pl: 0,
      norm: 0
    }

    const tradesRev = getters.tradesRev(symbol)
    const dayFilter = moment().subtract(1, 'days')
    const lastDayTrades = tradesRev.filter(trade => trade.time > dayFilter)
    const misc = getters.misc(symbol)
    const price = getters.price(symbol)
    const tt = misc.tt ? misc.tt : 1
    const bt = misc.bt ? misc.bt : 1
    const interval = 365 * 3600 * 24 * 1000
    const avghpl = interval * lastTradeOrDefault.pl / tt
    const avgh = interval * lastTradeOrDefault.norm / tt
    const pldiff = lastTradeOrDefault.pl - firstTradeOrDefault.pl
    const normdiff = tradesRev.reduce((acc, trade) => acc + trade.normch, 0)
    const aval = misc.pos * price.price

    return lastDayTrades
      .filter(trade => !trade.alert)
      .reduce((acc, trade) => {
        acc.gain += trade.gain
        acc.normch += trade.normch
        acc.volume += trade.volume
        acc.achg += trade.achg
        return acc
      }, {
        trades: lastDayTrades.length,
        gain: 0,
        normch: 0,
        volume: 0,
        achg: 0,
        avghpl,
        avghpl_pp: avghpl / bt * 100,
        avgh,
        avgh_pp: avgh / bt * 100,
        rating: rating(pldiff, normdiff),
        rpnl_pp: misc.rpnl / bt * 100,
        upnl_pp: misc.upnl / bt * 100,
        aval: aval,
        aval_pp: aval / bt * 100
      })
  },
  misc: state => (symbol) => state.data.misc[symbol],
  price: state => (symbol) => state.data.price[symbol],
  performance: state => state.data.performance,
  performanceRows: state => [...state.data.performance.rows].sort((a, b) => b[0] - a[0]),
  config: state => state.data.config,
  logs: state => state.data.logs
}

const rating = function (pldiff, normdiff) {
  if (pldiff > 0) {
    if (normdiff > pldiff) return 'A'
    else if (normdiff > 0 && normdiff < pldiff) return 'B'
    return 'C'
  } else if (normdiff > 0) {
    if (normdiff > -pldiff) return 'B'
    return 'D'
  }
  return 'E'
}

const descTime = function (a, b) {
  return b.time - a.time
}

const ascTime = function (a, b) {
  return a.time - b.time
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
    Vue.set(collection[key1], key2, value)
  } else {
    Vue.set(collection, key1, { [key2]: value })
  }
}

const updateDiffAll = function (trades, computed = null) {
  const sorted = trades.sort(ascTime)
  if (sorted.length === 0) return true
  const firstNext = sorted[0]
  let lastTrade = computed.lastTrade[firstNext.symbol]
  if (lastTrade && lastTrade.time >= firstNext.time) {
    return false
  }
  for (const trade of sorted) {
    updateDiff(lastTrade, trade)
    lastTrade = trade
  }
  computed.lastTrade[firstNext.symbol] = lastTrade
  return true
}

const updateDiff = function (l, r) {
  if (!l) return
  r.plDiff = safeDiff(r.pl, l.pl)
  r.rplDiff = safeDiff(r.rpl, l.rpl)
}

const safeDiff = function (a, b) {
  if (a === undefined) return b
  if (b === undefined) return a
  return a - b
}

const mutations = {
  [EVENTS_TRANSACTION]: (state, data) => {
    var computed = {
      enabled: {},
      lastTrade: {}
    }
    Object.entries(data.misc).forEach(([symbol, misc]) => {
      computed.enabled[symbol] = misc.en
    })

    Object.entries(data.orders).forEach(([symbol, orders]) => {
      data.orders[symbol] = orders.reduce((map, order) => {
        map[order.dirStr] = order
        return map
      }, { })
    })

    Object.entries(data.trades).forEach(([symbol, trades]) => {
      data.trades[symbol] = trades.reduce((map, trade) => {
        map[trade.key] = trade
        return map
      }, { })
    })

    Object.values(data.trades).forEach(trades => updateDiffAll(Object.values(trades), computed))
    state.computed = computed
    state.data = data
  },
  [EVENTS_BATCH]: (state, data) => {
    if (data.backendVersion) state.data.backendVersion = data.backendVersion
    if (data.config) state.data.config = data.config
    if (data.performance) state.data.performance = data.performance
    if (data.logs) data.logs.forEach(x => state.data.logs.push(x))

    Object.values(data.infos ?? {}).forEach(x => Vue.set(state.data.infos, x.symbol, x))
    Object.values(data.errors ?? {}).forEach(x => Vue.set(state.data.errors, x.symbol, x))
    Object.values(data.misc ?? {}).forEach(x => {
      if (x.en !== state.computed[x.symbol]) {
        Vue.set(state.computed.enabled, x.symbol, x.en)
      }

      Vue.set(state.data.misc, x.symbol, x)
    })
    Object.values(data.price ?? {}).forEach(x => Vue.set(state.data.price, x.symbol, x))
    Object.entries(data.orders ?? {}).forEach(([symbol, orders]) => orders.forEach(x => setNested(state.data.orders, symbol, x.dirStr, x)))
    Object.entries(data.trades ?? {}).forEach(([symbol, trades]) => {
      const updated = updateDiffAll(trades, state.computed)

      trades.forEach(trade => {
        setNested(state.data.trades, symbol, trade.key, trade)
      })

      if (!updated) {
        console.debug('trades recalculation is needed for symbol ' + symbol)
        state.computed.lastTrade[symbol] = null
        updateDiffAll(Object.values(state.data.trades[symbol]), state.computed)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
