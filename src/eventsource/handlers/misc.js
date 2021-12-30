// a: false
// accum: 0
// ba: 2.749548938
// be: -0.0004317614455
// bt: 0.008469025622
// cur_norm_buy: -2.226137974e-8
// cur_norm_sell: 0.00001579177931
// ltp: 0.00316373421
// mcp: 0.00316089593
// mdmb: 1
// mdms: 2.82
// mh: 0.003861150157
// ml: 0
// ms: 0.00003121571301
// mt: 1314
// pos: 2.51347765
// t: 0
// tt: 12338171614
// https://github.com/ondra-novak/mmbot/blob/acca3cd8a616b5155a8f16a902aee56c0dd8f112/src/main/report.cpp#L423
import { EVENTS_MISC_ADD } from '@/store/actions/events'

export default {
  commitName: EVENTS_MISC_ADD,
  map (dto) {
    return {
      symbol: dto.symbol,
      pos: dto.data.pos,
      tt: dto.data.tt,
      bt: dto.data.bt,
      a: dto.data.a, // achieve (initial position set)
      t: dto.data.t, // trading, order pending
      curNormBuy: dto.data.cur_norm_buy,
      curNormSell: dto.data.cur_norm_sell,
      rpnl: dto.data.rpnl,
      upln: dto.data.upnl,
      en: dto.data.en // enabled
      // data: dao.data
    }
  },
  reset (store) {
    store.misc = {}
  },
  add (store, dao) {
    store.misc[dao.symbol] = dao
  }
}
