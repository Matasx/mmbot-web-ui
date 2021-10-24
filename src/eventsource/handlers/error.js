import { EVENTS_ERROR_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_ERROR_ADD,
  map (dao) {
    dao.pk = dao.symbol

    const dto = {
      symbol: dao.symbol,
      error: null,
      buyError: null,
      sellError: null
    }

    if (dao.data) {
      dto.error = dao.data.gen
      dto.buyError = dao.data.buy
      dto.sellError = dao.data.sell
    }

    return dto
  },
  reset (store) {
    store.errors = {}
  },
  add (store, dto) {
    store.errors[dto.symbol] = dto
  }
}
