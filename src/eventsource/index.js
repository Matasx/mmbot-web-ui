import { EVENTS_TRANSACTION } from '@/store/actions/events'
import store from '@/store'
import tradeHandler from './handlers/trade'
import infoHandler from './handlers/info'
import versionHandler from './handlers/version'
import errorHandler from './handlers/error'

// -config
// -performance
// -price
// -order
// -misc
const handlers = {
  trade: tradeHandler,
  info: infoHandler,
  version: versionHandler,
  error: errorHandler
}

export function setupStream () {
  const source = new EventSource('https://www.mmbot.trade/live/data') // todo: baseUrl + auth

  let isTransaction = false
  let transaction = {}

  const resetTransaction = () => {
    transaction = {}
    Object.values(handlers).forEach(handler => handler.reset(transaction))
  }

  source.addEventListener('message', event => {
    if (event.data.startsWith('{')) {
      const payload = JSON.parse(event.data)

      const handler = handlers[payload.type]
      if (!handler) {
        console.warn('Missing handler for message type \'' + payload.type + '\'')
      } else {
        const mapped = handler.map(payload)
        if (isTransaction) {
          handler.add(transaction, mapped)
        } else {
          store.commit('events/' + handler.commitName, mapped)
        }
      }
    } else {
      if (event.data === '"refresh"') {
        console.log('Begin transaction')
        resetTransaction()
        isTransaction = true
      } else if (event.data === '"end_refresh"') {
        store.commit('events/' + EVENTS_TRANSACTION, transaction)
        resetTransaction()
        isTransaction = false
        console.log('Commit transaction')
      }
    }
  }, false)
}
