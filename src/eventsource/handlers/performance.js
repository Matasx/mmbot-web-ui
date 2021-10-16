import { EVENTS_PERFORMANCE_SET } from '@/store/actions/events'

export default {
  commitName: EVENTS_PERFORMANCE_SET,
  map (dao) {
    return dao.data
  },
  reset (store) {
    store.performance = {}
  },
  add (store, dto) {
    store.performance = dto
  }
}
