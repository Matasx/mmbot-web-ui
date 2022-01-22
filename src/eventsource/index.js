import { EVENTS_TRANSACTION, EVENTS_LAST_EVENT_TIME_SET } from '@/store/actions/events'
import store from '@/store'
import tradeHandler from './handlers/trade'
import infoHandler from './handlers/info'
import versionHandler from './handlers/version'
import errorHandler from './handlers/error'
import orderHandler from './handlers/order'
import miscHandler from './handlers/misc'
import priceHandler from './handlers/price'
import performanceHandler from './handlers/performance'
import configHandler from './handlers/config'
import logHandler from './handlers/log'
import Vue from 'vue'

const handlers = {
  trade: tradeHandler,
  info: infoHandler,
  version: versionHandler,
  error: errorHandler,
  order: orderHandler,
  misc: miscHandler,
  price: priceHandler,
  performance: performanceHandler,
  config: configHandler,
  log: logHandler
}

export function setupStream () {
  const source = new EventSource(Vue.prototype.$serviceUrl + 'data')

  let isTransaction = false
  let transaction = {}

  const resetTransaction = () => {
    transaction = {}
    Object.values(handlers).forEach(handler => handler.reset(transaction))
  }

  source.onerror = () => {
    source.close()
    setTimeout(setupStream, 5000)
  }

  source.onmessage = event => {
    if (event.data.startsWith('{')) {
      const payload = JSON.parse(event.data)

      const handler = handlers[payload.type]
      if (!handler) {
        console.warn('Missing handler for message type \'' + payload.type + '\'')
        console.debug('Payload: ' + JSON.stringify(payload))
      } else {
        const mapped = handler.map(payload)
        if (isTransaction) {
          handler.add(transaction, mapped)
        } else {
          console.debug('new data: ' + payload.type)
          if (handler.commitName) {
            store.commit('events/' + handler.commitName, mapped)
          } else {
            store.dispatch('events/' + handler.dispatchName, mapped)
          }
          store.commit('events/' + EVENTS_LAST_EVENT_TIME_SET, Date.now())
        }
      }
    } else {
      if (event.data === '"refresh"') {
        console.debug('Begin transaction')
        resetTransaction()
        isTransaction = true
      } else if (event.data === '"end_refresh"') {
        store.commit('events/' + EVENTS_TRANSACTION, transaction)
        resetTransaction()
        isTransaction = false
        console.debug('Commit transaction')
      }
      store.commit('events/' + EVENTS_LAST_EVENT_TIME_SET, Date.now())
    }
  }
}
