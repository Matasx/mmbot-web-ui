export default {
  map (dto) {
    return dto.data
  },
  reset (store) {
    store.performance = null
  },
  add (store, dao) {
    store.performance = dao
  }
}
