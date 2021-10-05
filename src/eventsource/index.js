import {
  EVENTS_TRADES_ADD,
  EVENTS_TRADES_SET,
  EVENTS_INFOS_ADD,
  EVENTS_INFOS_SET
} from '../store/actions/events'
import store from '../store'

export function setupStream () {
  const source = new EventSource('https://www.mmbot.trade/live/data')

  let isRefresh = false

  let localTrades = []
  let localInfos = []

  source.addEventListener('message', event => {
    if (event.data.startsWith('{')) {
      const payload = JSON.parse(event.data)

      switch (payload.type) {
        case 'trade':
          payload.pk = JSON.stringify(payload.id) + ';' + payload.symbol
          payload.alert = payload.data.achg === 0 && JSON.stringify(payload.data.id).startsWith('"ALERT')

          if (isRefresh) {
            localTrades.push(payload)
          } else {
            store.commit('events/' + EVENTS_TRADES_ADD, payload)
          }
          break

        case 'info':
          if (isRefresh) {
            localInfos.push(payload)
          } else {
            store.commit('events/' + EVENTS_INFOS_ADD, payload)
          }
          break

        default:
          break
      }
      // console.log(payload)
      // -config
      // -performance
      // -info
      // -trade
      // -price
      // -order
      // -misc
    } else {
      // refresh
      // end_refresh
      // ping

      if (event.data === '"refresh"') {
        console.log('start refresh')
        localTrades = []
        localInfos = []
        isRefresh = true
        // store.commit('events/' + EVENTS_PURGE)
      } else if (event.data === '"end_refresh"') {
        store.commit('events/' + EVENTS_INFOS_SET, localInfos)
        store.commit('events/' + EVENTS_TRADES_SET, localTrades)
        // console.log(localInfos)
        localTrades = []
        localInfos = []
        isRefresh = false
        console.log('end refresh')
      }

      // store.commit('events/' + EVENTS_ADD, event.data)
      // console.log(event.data)
    }
    // let data = JSON.parse(event.data);
  }, false)
}
