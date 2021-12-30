import common from './common'

export default {
  dispatchName: 'addTrade',
  map (dto) {
    return {
      key: dto.symbol + '' + JSON.stringify(dto.data.id),
      symbol: dto.symbol,
      alert: dto.data.achg === 0, // && JSON.stringify(dao.data.id).startsWith('"ALERT'),
      buy: dto.data.achg > 0,
      id: dto.data.id, // Rransaction id
      time: dto.data.time,
      normch: dto.data.normch, // Normalized P/L
      achg: dto.data.achg, // Size
      aachg: Math.abs(dto.data.achg),
      price: dto.data.price, // Price
      gain: dto.data.gain, // P/L
      volume: dto.data.volume, // currency total
      pl: dto.data.pl, // P/L from position
      rpl: dto.data.rpl, // Realized P/L
      norm: dto.data.norm,
      man: dto.data.man, // Manual trade
      p0: dto.data.p0, // Neutral price
      pos: dto.data.pos, // Position
      dp0: dto.data.price - dto.data.p0, // Netral price distance to price
      plDiff: 0,
      rplDiff: 0
      // data: JSON.stringify(dao.data, undefined, 2)
    }
  },
  reset (store) {
    store.trades = {}
  },
  add (store, dao) {
    common.addNested(store.trades, dao.symbol, dao.id, dao)
  }
}
