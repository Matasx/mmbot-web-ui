import { EVENTS_INFO_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_INFO_ADD,
  map (dao) {
    dao.pk = dao.symbol
    return dao
  },
  reset (store) {
    store.infos = {}
  },
  add (store, dto) {
    store.infos[dto.pk] = dto
  }
}
