import { EVENTS_CONFIG_SET } from '@/store/actions/events'

export default {
  commitName: EVENTS_CONFIG_SET,
  map (dao) {
    return dao.data
  },
  reset (store) {
    store.config = {}
  },
  add (store, dto) {
    store.config = dto
  }
}
