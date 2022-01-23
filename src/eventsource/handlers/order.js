import common from './common'

export default {
  map (dto) {
    return {
      dir: dto.dir, // -2, -1, 1, 2
      dirStr: dto.dir.toString(),
      symbol: dto.symbol,
      price: dto.data.price,
      size: dto.data.size
    }
  },
  reset (store) {
    store.orders = {}
  },
  add (store, dao) {
    common.addNested(store.orders, dao.symbol, dao)
  }
}
