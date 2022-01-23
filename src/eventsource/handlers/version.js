export default {
  map (dto) {
    return dto.data
  },
  reset (store) {
    store.backendVersion = null
  },
  add (store, dao) {
    store.backendVersion = dao
  }
}
