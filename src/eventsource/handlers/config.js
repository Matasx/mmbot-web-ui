import { EVENTS_CONFIG_SET } from '@/store/actions/events'

export default {
  commitName: EVENTS_CONFIG_SET,
  map (dto) {
    return dto.data
  },
  reset (store) {
    store.config = {}
  },
  add (store, dao) {
    store.config = dao
  }
}
