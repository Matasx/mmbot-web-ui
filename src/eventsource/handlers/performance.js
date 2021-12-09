import { EVENTS_PERFORMANCE_SET } from '@/store/actions/events'

export default {
  commitName: EVENTS_PERFORMANCE_SET,
  map (dto) {
    return dto.data
  },
  reset (store) {
    store.performance = {}
  },
  add (store, dao) {
    store.performance = dao
  }
}
