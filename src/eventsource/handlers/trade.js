import { EVENTS_TRADE_ADD } from '@/store/actions/events'
import common from './common'

export default {
  commitName: EVENTS_TRADE_ADD,
  map (dao) {
    return {
      key: dao.symbol + '' + JSON.stringify(dao.data.id),
      symbol: dao.symbol,
      alert: dao.data.achg === 0, // && JSON.stringify(dao.data.id).startsWith('"ALERT'),
      buy: dao.data.achg > 0,
      id: dao.data.id, // Rransaction id
      time: dao.data.time,
      normch: dao.data.normch, // Normalized P/L
      achg: dao.data.achg, // Size
      aachg: Math.abs(dao.data.achg),
      price: dao.data.price, // Price
      gain: dao.data.gain, // P/L
      volume: dao.data.volume, // currency total
      pl: dao.data.pl, // P/L from position
      rpl: dao.data.rpl, // Realized P/L
      norm: dao.data.norm,
      man: dao.data.man, // Manual trade
      p0: dao.data.p0, // Neutral price
      pos: dao.data.pos, // Position
      dp0: dao.data.price - dao.data.p0 // Netral price distance to price
      // data: JSON.stringify(dao.data, undefined, 2)
    }
  },
  reset (store) {
    store.trades = {}
  },
  add (store, dto) {
    common.addNested(store.trades, dto.symbol, dto.id, dto)
  }
}
