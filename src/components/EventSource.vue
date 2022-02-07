<template>
  <b-nav-item id="connectivity">
    <fa-icon v-if="!viewer" icon="exclamation" class="text-danger"/>
    <fa-icon v-else-if="isConnected" icon="wifi"/>
    <fa-icon v-else icon="sync-alt" class="text-danger" spin/>
    <b-popover v-if="viewer" target="connectivity" triggers="hover" placement="bottom" variant="secondary">
      <template #title>Last update</template>
      {{ timeDiffSec }}s ago
    </b-popover>
    <b-popover v-else target="connectivity" triggers="hover" placement="bottom" variant="danger">
      <template #title>Unauthorized access</template>
      Please login
    </b-popover>
  </b-nav-item>
</template>

<script>
import {
  EVENTS_TRANSACTION,
  EVENTS_BATCH
} from '@/store/actions/events'
import tradeHandler from '@/eventsource/handlers/trade'
import infoHandler from '@/eventsource/handlers/info'
import versionHandler from '@/eventsource/handlers/version'
import errorHandler from '@/eventsource/handlers/error'
import orderHandler from '@/eventsource/handlers/order'
import miscHandler from '@/eventsource/handlers/misc'
import priceHandler from '@/eventsource/handlers/price'
import performanceHandler from '@/eventsource/handlers/performance'
import configHandler from '@/eventsource/handlers/config'
import logHandler from '@/eventsource/handlers/log'
import { createNamespacedHelpers } from 'vuex'
import { AUTH_CHECK } from '@/store/actions/auth'
const events = createNamespacedHelpers('events')
const auth = createNamespacedHelpers('auth')

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

let source = null

export default {
  name: 'EventSource',
  data () {
    return {
      batch: null,
      currentTime: 0,
      lastEventTime: 0
    }
  },
  computed: {
    ...auth.mapGetters(['viewer']),
    timeDiffSec () {
      return (this.timeDiff / 1000).toFixed(0)
    },
    timeDiff () {
      return Math.max(this.currentTime - this.lastEventTime, 0)
    },
    isConnected () {
      return this.timeDiff < 70000
    }
  },
  watch: {
    viewer (newViewer) {
      if (newViewer) {
        this.setupStream()
      } else if (source) {
        source.close()
        source = null
      }
    }
  },
  methods: {
    ...auth.mapActions({
      authCheck: AUTH_CHECK
    }),
    ...events.mapMutations({
      commitBatch: EVENTS_BATCH,
      commitTransaction: EVENTS_TRANSACTION
    }),
    updateCurrentTime () {
      this.currentTime = Date.now()
    },
    setupConnectivityIndicator () {
      setInterval(this.updateCurrentTime, 1000)
    },
    setupDispatch () {
      this.batch = this.newTransaction()
      setInterval(this.dispatch, 5000)
    },
    newTransaction () {
      const transaction = {
        empty: true
      }
      Object.values(handlers).forEach(handler => handler.reset(transaction))
      return transaction
    },
    dispatch () {
      if (this.batch.empty) return

      this.commitBatch(this.batch)
      this.lastEventTime = Date.now()
      this.batch = this.newTransaction()
    },
    setupStream () {
      this.batch = this.newTransaction()

      if (!this.viewer) return

      if (source) {
        source.close()
      }

      source = new EventSource(this.$serviceUrl + 'api/data', {
        withCredentials: this.$withCredentials
      })

      let isTransaction = false
      let transaction = {}

      const resetTransaction = () => {
        transaction = this.newTransaction()
      }

      source.onerror = async () => {
        source.close()
        source = null
        try {
          await this.authCheck(true)
        } finally {
          setTimeout(this.setupStream, 5000)
        }
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
              transaction.empty = false
              handler.add(transaction, mapped)
            } else {
              this.batch.empty = false
              handler.add(this.batch, mapped)
            }
          }
        } else {
          if (event.data === '"refresh"') {
            console.debug('Begin transaction')
            resetTransaction()
            isTransaction = true
          } else if (event.data === '"end_refresh"') {
            this.commitTransaction(transaction)
            resetTransaction()
            isTransaction = false
            console.debug('Commit transaction')
          }
          this.lastEventTime = Date.now()
        }
      }
    }
  },
  mounted () {
    this.setupConnectivityIndicator()
    this.setupDispatch()
    this.setupStream()
  }
}
</script>
