export default {
  map (dto) {
    return {
      avg: dto.data.avg,
      hdr: dto.data.hdr,
      rows: dto.data.rows,
      sums: dto.data.sums
    }
  },
  reset (store) {
    store.performance = null
  },
  add (store, dao) {
    store.performance = dao
  }
}
