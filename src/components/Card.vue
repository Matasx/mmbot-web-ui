<template>
  <b-card no-body :border-variant="stats.avgh >= 0 ? 'success' : 'danger'" align="center">
    <b-card-header>
      <b-img width="32" :src="$serviceUrl + info.brokerIcon" alt="Ex."></b-img> {{ info.title }} <span class="text-info">pos: <price :value="localMisc.pos" :currency-info="info.assetInfo" /></span>
      <b-progress class="mt-2" :max="totalSize">
        <b-progress-bar v-if="buyOrder" :value="buySize" variant="success" class="text-white">
          <price :value="buyOrder.price - priceCurrent.price" :currency-info="info.assetInfo" add-sign/>
        </b-progress-bar>
        <b-progress-bar :value="priceSizeWithSlider" variant="info" class="text-white font-weight-bold">
          <price :value="priceCurrent.price" :currency-info="info.assetInfo"/>
        </b-progress-bar>
        <b-progress-bar v-if="sellOrder" :value="sellSize" variant="danger" class="text-white">
          <price :value="sellOrder.price - priceCurrent.price" :currency-info="info.assetInfo" add-sign/>
        </b-progress-bar>
      </b-progress>
      <b-progress class="mt-1" :max="totalSize">
        <b-progress-bar v-if="buyOrder" :value="buySize" variant="success" class="text-white">
          <price :value="buyOrder.size" :add-symbol="false" add-sign/>
        </b-progress-bar>
        <b-progress-bar :value="priceLeftSize" variant="primary"></b-progress-bar>
        <b-progress-bar :value="sliderSize" variant="info"></b-progress-bar>
        <b-progress-bar :value="priceRightSize" variant="primary"></b-progress-bar>
        <b-progress-bar v-if="sellOrder" :value="sellSize" variant="danger" class="text-white">
          <price :value="sellOrder.size" :add-symbol="false" add-sign/>
        </b-progress-bar>
      </b-progress>
    </b-card-header>
    <b-card-body v-if="showDetails">
      <b-card-text>
        Avg. P/L position: <price :value="stats.avghpl" :currency-info="info.currencyInfo" add-sign :class="stats.avghpl >= 0 ? 'text-success' : 'text-danger'" />/y
        <b-badge :variant="stats.avghpl_pp >= 0 ? 'success' : 'danger'" pill><price :value="stats.avghpl_pp" :add-symbol="false" add-sign /> %</b-badge><br />

        Avg. income norm: <price :value="stats.avgh" :currency-info="info.currencyInfo" add-sign :class="stats.avgh >= 0 ? 'text-success' : 'text-danger'" />/y
        <b-badge :variant="stats.avgh_pp >= 0 ? 'success' : 'danger'" pill><price :value="stats.avgh_pp" :add-symbol="false" add-sign /> %</b-badge>
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
  </b-card>
</template>

<script>
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
import Price from './Price.vue'

const { mapGetters } = createNamespacedHelpers('events')

// todo: still working view if price is uknown
// todo: test when adding new trader
// todo: alerts
// todo: performance metrics .. optionally hidden
// todo: border based on 24h performance
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
    Price
  },
  data () {
    return {
      totalSize: 100,
      orderSize: 30,
      sliderSize: 2
    }
  },
  computed: {
    ...mapGetters(['misc', 'ordersMap', 'price', 'trades']),
    localTrades () {
      return this.trades(this.info.symbol)
    },
    orderedTrades () {
      return [...this.localTrades]
        .sort((a, b) => b.time - a.time)
    },
    lastTrade () {
      return this.orderedTrades.length > 0 ? this.orderedTrades[0] : null
    },
    lastDayTrades () {
      // todo: refresh hourly or so ...
      const dayFilter = moment().subtract(1, 'days')
      return this.localTrades
        .filter(trade => trade.time > dayFilter)
    },
    stats () {
      if (!this.lastTrade) return null

      // const intervals = [
      //   ['h',3600],
      //   ['d',3600 * 24],
      //   ['w',3600 * 24 * 7],
      //   ['m',30 * 3600 * 24],
      //   ['y',365 * 3600 * 24]
      // ]

      const interval = 365 * 3600 * 24 * 1000
      const avghpl = interval * this.lastTrade.pl / this.localMisc.tt
      const avgh = interval * this.lastTrade.norm / this.localMisc.tt

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
          avghpl_pp: avghpl / this.localMisc.bt * 100,
          avgh,
          avgh_pp: avgh / this.localMisc.bt * 100
        })
    },
    localMisc () {
      return this.misc(this.info.symbol)
    },
    buyOrder () {
      // todo: accept any -2 -3 etc.
      return this.ordersMap(this.info.symbol)[1]
    },
    buySize () {
      return this.buyOrder ? this.orderSize : 0
    },
    sellOrder () {
      return this.ordersMap(this.info.symbol)[-1]
    },
    sellSize () {
      return this.sellOrder ? this.orderSize : 0
    },
    priceCurrent () {
      return this.price(this.info.symbol)
    },
    priceSizeWithSlider () {
      return this.totalSize - this.buySize - this.sellSize
    },
    priceSize () {
      return this.priceSizeWithSlider - this.sliderSize
    },
    priceLeftSize () {
      return this.priceSize - this.priceRightSize
    },
    priceRightSize () {
      if (!this.priceCurrent || (!this.buySize && !this.sellSize)) {
        return this.priceSize * 0.5
      }
      if (!this.buySize) {
        return this.priceSize
      }
      if (!this.sellSize) {
        return 0
      }
      const diff = this.sellOrder.price - this.buyOrder.price
      const pos = this.sellOrder.price - this.priceCurrent.price

      return (pos * this.priceSize) / diff
    }
  }
}
</script>
