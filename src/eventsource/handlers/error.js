import { EVENTS_ERROR_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_ERROR_ADD,
  map (dto) {
    dto.pk = dto.symbol

    const dao = {
      symbol: dto.symbol,
      error: null,
      buyError: null,
      sellError: null
    }

    if (dto.data) {
      dao.error = dto.data.gen
      dao.buyError = dto.data.buy
      dao.sellError = dto.data.sell
    }

    return dao
  },
  reset (store) {
    store.errors = {}
  },
  add (store, dao) {
    store.errors[dao.symbol] = dao
  }
}
