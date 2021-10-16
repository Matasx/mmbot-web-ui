import { EVENTS_ORDER_ADD } from '@/store/actions/events'
import common from './common'

export default {
  commitName: EVENTS_ORDER_ADD,
  map (dao) {
    return {
      dir: dao.dir, // -2, -1, 1, 2
      dirStr: dao.dir.toString(),
      symbol: dao.symbol,
      price: dao.data.price,
      size: dao.data.size
    }
  },
  reset (store) {
    store.orders = {}
  },
  add (store, dto) {
    common.addNested(store.orders, dto.symbol, dto.dirStr, dto)
  }
}
