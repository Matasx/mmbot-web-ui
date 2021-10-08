import { EVENTS_INFO_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_INFO_ADD,
  map (dao) {
    return {
      pk: dao.symbol,
      symbol: dao.symbol,
      brokerIcon: dao.data.brokerIcon,
      brokerName: dao.data.brokerName,
      asset: dao.data.asset, // BTC
      currency: dao.data.currency, // USD
      title: dao.data.title // readable name
    }
  },
  reset (store) {
    store.infos = {}
  },
  add (store, dto) {
    store.infos[dto.pk] = dto
  }
}
