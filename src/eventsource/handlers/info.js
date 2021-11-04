import { EVENTS_INFO_ADD } from '@/store/actions/events'
import CurrencyMap from '@/data/currency'

export default {
  commitName: EVENTS_INFO_ADD,
  map (dao) {
    const assetCurrency = CurrencyMap[dao.data.asset.toUpperCase()]
    const currencyCurrency = CurrencyMap[dao.data.currency.toUpperCase()]

    return {
      symbol: dao.symbol,
      brokerIcon: dao.data.brokerIcon,
      brokerName: dao.data.brokerName.toUpperCase(),
      asset: dao.data.asset, // BTC
      assetInfo: {
        name: assetCurrency ? assetCurrency.name : dao.data.asset,
        symbol: assetCurrency ? assetCurrency.symbol : dao.data.asset
      },
      currency: dao.data.currency, // USD
      currencyInfo: {
        name: currencyCurrency ? currencyCurrency.name : dao.data.currency,
        symbol: currencyCurrency ? currencyCurrency.symbol : dao.data.currency
      },
      title: dao.data.title, // readable name
      inverted: dao.data.inverted
    }
  },
  reset (store) {
    store.infos = {}
  },
  add (store, dto) {
    store.infos[dto.symbol] = dto
  }
}
