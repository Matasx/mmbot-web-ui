<template>
  <b-card no-body :border-variant="stats.avghpl >= 0 ? 'success' : 'danger'">
    <b-card-header>
      <div class="clearfix">
        <span class="float-left h5">
          <broker-name :info="info"/>
        </span>
        <span class="float-right text-info">
          <span v-if="localMisc.pos !== undefined">
            <span v-b-tooltip.top title="Position"><fa-icon icon="map-pin" class="mr-1"/></span>
            <price :value="localMisc.pos" :currency-info="info.assetInfo"/>
            <b-spinner v-if="achieve" small type="grow" class="ml-1"/>
          </span>
        </span>
      </div>
      <order-slider :info="info"/>
    </b-card-header>
    <b-card-body v-if="showDetails">
      <b-card-text>
        <div v-if="dashboardSettings.avgPlPosition" class="clearfix">
          <span class="float-left">Avg. P/L position:</span>
          <span class="float-right">
            <b-badge :variant="stats.avghpl >= 0 ? 'success' : 'danger'" pill class="mr-1 text-white"><price :value="stats.avghpl" :currency-info="info.currencyInfo" add-sign />/y</b-badge>
            <b-badge :variant="stats.avghpl_pp >= 0 ? 'success' : 'danger'" pill class="text-white"><price :value="stats.avghpl_pp" :add-symbol="false" add-sign :allow-micro="false" /> %</b-badge>
          </span>
        </div>
        <div v-if="dashboardSettings.avgPlNorm" class="clearfix">
          <span class="float-left">Avg. income norm:</span>
          <span class="float-right">
            <b-badge :variant="stats.avgh >= 0 ? 'success' : 'danger'" pill class="mr-1 text-white"><price :value="stats.avgh" :currency-info="info.currencyInfo" add-sign />/y</b-badge>
            <b-badge :variant="stats.avgh_pp >= 0 ? 'success' : 'danger'" pill class="text-white"><price :value="stats.avgh_pp" :add-symbol="false" add-sign :allow-micro="false" /> %</b-badge>
          </span>
        </div>
        <!-- 24h t: {{ stats.trades }}<br/>
        vol: {{ stats.volume }}<br/>
        pos: {{ stats.achg }}<br/>
        p/l: {{ stats.gain }}<br/>
        norm: {{ stats.normch }}<br/>
        Avg. p/l pos: {{ stats.avghpl }} / {{ stats.avghpl_pp }} %<br/>
        Avg. income norm.: {{ stats.avgh }} / {{ stats.avgh_pp }} %<br/>
        {{ localMisc.data }}<br/>
        {{ buyOrder }} -->
      </b-card-text>
    </b-card-body>
    <b-card-footer v-if="localError.error" footer-text-variant="danger">
      <fa-icon icon="burn" class="mr-1"/>
      <em>{{ localError.error }}</em>
    </b-card-footer>
  </b-card>
</template>

<script>
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
import Price from './Price.vue'
import OrderSlider from './OrderSlider.vue'
import BrokerName from './BrokerName.vue'

const settings = createNamespacedHelpers('settings')
const events = createNamespacedHelpers('events')

// todo: detail layout
// todo: pick interval
// todo: auto refresh 24hr stats (may not be needed)
export default {
  name: 'Card',
  props: {
    info: {
      type: Object,
      required: true
    },
    showDetails: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Price,
    OrderSlider,
    BrokerName
  },
  computed: {
    ...events.mapGetters(['misc', 'tradesRev', 'lastTrade', 'error']),
    ...settings.mapGetters(['dashboardSettings']),
    localError () {
      return this.error(this.info.symbol) ?? {}
    },
    localMisc () {
      return this.misc(this.info.symbol) ?? {}
    },
    achieve () {
      return this.localMisc.a
    },
    lastDayTrades () {
      // todo: refresh hourly or so ...
      const dayFilter = moment().subtract(1, 'days')
      return this.tradesRev(this.info.symbol)
        .filter(trade => trade.time > dayFilter)
    },
    stats () {
      // const intervals = [
      //   ['h',3600],
      //   ['d',3600 * 24],
      //   ['w',3600 * 24 * 7],
      //   ['m',30 * 3600 * 24],
      //   ['y',365 * 3600 * 24]
      // ]

      const lastTradeOrDefault = this.lastTrade(this.info.symbol) ?? {
        pl: 0,
        norm: 0
      }
      const tt = this.localMisc.tt ? this.localMisc.tt : 1
      const bt = this.localMisc.bt ? this.localMisc.bt : 1
      const interval = 365 * 3600 * 24 * 1000
      const avghpl = interval * lastTradeOrDefault.pl / tt
      const avgh = interval * lastTradeOrDefault.norm / tt

      return this.lastDayTrades
        .filter(trade => !trade.alert)
        .reduce((acc, trade) => {
          acc.gain += trade.gain
          acc.normch += trade.normch
          acc.volume += trade.volume
          acc.achg += trade.achg
          return acc
        }, {
          trades: this.lastDayTrades.length,
          gain: 0,
          normch: 0,
          volume: 0,
          achg: 0,
          avghpl,
          avghpl_pp: avghpl / bt * 100,
          avgh,
          avgh_pp: avgh / bt * 100
        })
    }
  }
}
</script>
