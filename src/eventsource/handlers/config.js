export default {
  map (dto) {
    return dto.data
  },
  reset (store) {
    store.config = null
  },
  add (store, dao) {
    store.config = dao
  }
}
