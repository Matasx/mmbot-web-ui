import { EVENTS_VERSION_SET } from '@/store/actions/events'

export default {
  commitName: EVENTS_VERSION_SET,
  map (dao) {
    return dao.data
  },
  reset (store) {
    store.backendVersion = 'unknown'
  },
  add (store, dto) {
    store.backendVersion = dto
  }
}
