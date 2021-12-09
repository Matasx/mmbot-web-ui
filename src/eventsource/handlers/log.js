// data: "2021-10-14 11:52:26 Error [0002][okex_OKB-BTC] okex: Connection reset by peer (getOpenOrders)"
// type: "log"

import { EVENTS_LOG_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_LOG_ADD,
  map (dto) {
    return dto.data
  },
  reset (store) {
    store.logs = []
  },
  add (store, dao) {
    store.logs.push(dao)
  }
}
