import { EVENTS_PRICE_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_PRICE_ADD,
  map (dto) {
    return {
      symbol: dto.symbol,
      price: dto.data
    }
  },
  reset (store) {
    store.price = {}
  },
  add (store, dao) {
    store.price[dao.symbol] = dao
  }
}
