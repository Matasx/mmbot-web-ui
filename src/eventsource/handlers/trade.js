import { EVENTS_TRADES_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_TRADES_ADD,
  map (dao) {
    // todo: create new object and copy over all props -> change to flat structure
    dao.pk = JSON.stringify(dao.id) + ';' + dao.symbol
    dao.alert = dao.data.achg === 0 && JSON.stringify(dao.data.id).startsWith('"ALERT')
    return dao
  },
  reset (store) {
    store.trades = {}
  },
  add (store, dto) {
    store.trades[dto.pk] = dto
  }
}
