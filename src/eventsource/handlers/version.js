import { EVENTS_VERSION_SET } from '@/store/actions/events'

export default {
  commitName: EVENTS_VERSION_SET,
  map (dto) {
    return dto.data
  },
  reset (store) {
    store.backendVersion = 'unknown'
  },
  add (store, dao) {
    store.backendVersion = dao
  }
}
