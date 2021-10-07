import { EVENTS_TRADE_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_TRADE_ADD,
  map (dao) {
    return {
      pk: JSON.stringify(dao.id) + ';' + dao.symbol,
      symbol: dao.symbol,
      alert: dao.data.achg === 0 && JSON.stringify(dao.data.id).startsWith('"ALERT'),
      id: dao.data.id, // transaction id
      time: dao.data.time,
      normch: dao.data.normch, // normalized P/L
      achg: dao.data.achg, // size
      price: dao.data.price, // price
      gain: dao.data.gain // P/L
    }
  },
  reset (store) {
    store.trades = {}
  },
  add (store, dto) {
    store.trades[dto.pk] = dto
  }
}
