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
      id: dao.data.id, // transaction id
      time: dao.data.time,
      normch: dao.data.normch, // normalized P/L
      achg: dao.data.achg, // size
      price: dao.data.price, // price
      gain: dao.data.gain, // P/L
      volume: dao.data.volume, // currency total
      pl: dao.data.pl, // P/L from position
      norm: dao.data.norm,
      data: JSON.stringify(dao.data, undefined, 2)
    }
  },
  reset (store) {
    store.trades = {}
  },
  add (store, dto) {
    common.addNested(store.trades, dto.symbol, dto.id, dto)
  }
}
