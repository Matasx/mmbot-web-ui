import { EVENTS_ERROR_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_ERROR_ADD,
  map (dao) {
    dao.pk = dao.symbol

    const dto = {
      pk: dao.symbol,
      type: null,
      error: null,
      buyError: null,
      sellError: null
    }

    if (dao.data) {
      if (dao.data.gen) {
        dto.type = 'generic'
        dto.error = dao.data.gen
      } else if (dao.data.buy || dao.data.sell) {
        dto.type = 'order'
        dto.buyError = dao.data.buy
        dto.sellError = dao.data.sell
      }
    }

    return dto
  },
  reset (store) {
    store.errors = {}
  },
  add (store, dto) {
    store.errors[dto.pk] = dto
  }
}
