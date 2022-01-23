export default {
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
