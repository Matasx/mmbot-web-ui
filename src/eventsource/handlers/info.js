import { EVENTS_INFO_ADD } from '@/store/actions/events'
import CurrencyMap from '@/data/currency'

export default {
  commitName: EVENTS_INFO_ADD,
  map (dto) {
    const assetCurrency = CurrencyMap[dto.data.asset.toUpperCase()]
    const currencyCurrency = CurrencyMap[dto.data.currency.toUpperCase()]

    return {
      symbol: dto.symbol,
      brokerIcon: dto.data.brokerIcon,
      brokerName: dto.data.brokerName.toUpperCase(),
      asset: dto.data.asset, // BTC
      assetInfo: {
        name: assetCurrency ? assetCurrency.name : dto.data.asset,
        symbol: assetCurrency ? assetCurrency.symbol : dto.data.asset
      },
      currency: dto.data.currency, // USD
      currencyInfo: {
        name: currencyCurrency ? currencyCurrency.name : dto.data.currency,
        symbol: currencyCurrency ? currencyCurrency.symbol : dto.data.currency
      },
      title: dto.data.title, // readable name
      inverted: dto.data.inverted,
      order: dto.data.order,
      emulated: dto.data.emulated
    }
  },
  reset (store) {
    store.infos = {}
  },
  add (store, dao) {
    store.infos[dao.symbol] = dao
  }
}
