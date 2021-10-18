import { EVENTS_PRICE_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_PRICE_ADD,
  map (dao) {
    return {
      symbol: dao.symbol,
      price: dao.data
    }
  },
  reset (store) {
    store.price = {}
  },
  add (store, dto) {
    store.price[dto.symbol] = dto
  }
}
