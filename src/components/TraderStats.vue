<template>
  <div>
    <div class="clearfix">
      <span class="float-left h5">
        <broker-name :info="info"/>
      </span>
      <span class="float-right text-info">
        <span v-if="localMisc.pos !== undefined">
          <fa-icon :icon="info.emulated ? 'vial' : 'map-pin'" class="mr-1 mb-1"/>
          <price :value="localMisc.pos" :currency-info="info.assetInfo" :title="info.emulated ? 'Virtual position (trainer)' : 'Position'"/>
          <b-spinner v-if="achieve" small type="grow" class="ml-1 mb-1"/>
        </span>
      </span>
    </div>
    <order-slider :info="info" class="mb-2"/>
    <b-table-simple hover small responsive caption-top>
      <caption>Statistics:</caption>
      <b-tbody>
        <b-tr>
          <b-td>Rating:</b-td>
          <b-th class="text-right"><rating :rating="stats.rating"/></b-th>
          <b-th class="text-right">{{ stats.rating }}</b-th>
        </b-tr>
        <b-tr>
          <b-td>Enter price:</b-td>
          <b-th class="text-right"><price :value="localMisc.op" :currency-info="info.currencyInfo" title="Cost basis" class="text-info" /></b-th>
          <b-th class="text-right"><price :value="openPriceDiff" :currency-info="percentageInfo" compress-title add-sign :allow-micro="false" title="Difference to current price" :class="openPriceDiff < 0 ? 'text-success' : 'text-danger'" /></b-th>
        </b-tr>
        <b-tr>
          <b-td>Value of asset:</b-td>
          <b-th class="text-right"><price :value="stats.aval" :currency-info="info.currencyInfo" title="Asset" class="text-info" /></b-th>
          <b-th class="text-right"><price :value="stats.aval_pp" :currency-info="percentageInfo" compress-title :allow-micro="false" title="Total portion of budget" class="text-info" /></b-th>
        </b-tr>
        <b-tr>
          <b-td>Realized P/L:</b-td>
          <b-th class="text-right"><price :value="localMisc.rpnl" :currency-info="info.currencyInfo" add-sign colored title="Total" /></b-th>
          <b-th class="text-right"><price :value="stats.rpnl_pp" :currency-info="percentageInfo" compress-title add-sign colored :allow-micro="false" title="Total portion of budget" /></b-th>
        </b-tr>
        <b-tr>
          <b-td>Unrealized P/L:</b-td>
          <b-th class="text-right"><price :value="localMisc.upnl" :currency-info="info.currencyInfo" add-sign colored title="Total" /></b-th>
          <b-th class="text-right"><price :value="stats.upnl_pp" :currency-info="percentageInfo" compress-title add-sign colored :allow-micro="false" title="Total portion of budget" /></b-th>
        </b-tr>
        <b-tr>
          <b-td>Avg. P/L position:</b-td>
          <b-th class="text-right"><price :value="stats.avghpl" :currency-info="info.currencyInfo" add-sign colored title="Per year" />/y</b-th>
          <b-th class="text-right"><price :value="stats.avghpl_pp" :currency-info="percentageInfo" compress-title add-sign colored :allow-micro="false" title="Per year" />/y</b-th>
        </b-tr>
        <b-tr>
          <b-td>Avg. income norm:</b-td>
          <b-th class="text-right"><price :value="stats.avgh" :currency-info="info.currencyInfo" add-sign colored title="Per year" />/y</b-th>
          <b-th class="text-right"><price :value="stats.avgh_pp" :currency-info="percentageInfo" compress-title add-sign colored :allow-micro="false" title="Per year" />/y</b-th>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <!-- 24h t: {{ stats.trades }}<br/>
    vol: {{ stats.volume }}<br/>
    pos: {{ stats.achg }}<br/>
    p/l: {{ stats.gain }}<br/>
    norm: {{ stats.normch }}<br/>
    Avg. p/l pos: {{ stats.avghpl }} / {{ stats.avghpl_pp }} %<br/>
    Avg. income norm.: {{ stats.avgh }} / {{ stats.avgh_pp }} %<br/>
    {{ localMisc.data }}<br/>
    {{ buyOrder }} -->
    <!-- <b-card-footer v-if="localError.error" footer-text-variant="danger">
      <fa-icon icon="burn" class="mr-2 mb-1"/>
      <em>{{ localError.error }}</em>
    </b-card-footer> -->
  </div>
</template>

<script>
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
import Price from './Price.vue'
import OrderSlider from './OrderSlider.vue'
import BrokerName from './BrokerName.vue'
import Rating from './Rating.vue'

const { mapGetters } = createNamespacedHelpers('events')

// todo: detail layout
// todo: pick interval
// todo: auto refresh 24hr stats (may not be needed)
export default {
  name: 'TraderStats',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  components: {
    Price,
    OrderSlider,
    BrokerName,
    Rating
  },
  computed: {
    ...mapGetters(['misc', 'price', 'tradesRev', 'firstTrade', 'lastTrade', 'error']),
    percentageInfo () {
      return {
        symbol: '%',
        name: '%'
      }
    },
    localError () {
      return this.error(this.info.symbol) ?? {}
    },
    localMisc () {
      return this.misc(this.info.symbol) ?? {}
    },
    priceCurrent () {
      return this.price(this.info.symbol)
    },
    openPriceDiff () {
      if (this.priceCurrent.price === 0) return 0
      return (this.localMisc.op - this.priceCurrent.price) / this.priceCurrent.price * 100
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

      const firstTradeOrDefault = this.firstTrade(this.info.symbol) ?? {
        pl: 0,
        norm: 0
      }
      const lastTradeOrDefault = this.lastTrade(this.info.symbol) ?? {
        pl: 0,
        norm: 0
      }
      const misc = this.localMisc
      const tt = misc.tt ? misc.tt : 1
      const bt = misc.bt ? misc.bt : 1
      const interval = 365 * 3600 * 24 * 1000
      const avghpl = interval * lastTradeOrDefault.pl / tt
      const avgh = interval * lastTradeOrDefault.norm / tt
      const pldiff = lastTradeOrDefault.pl - firstTradeOrDefault.pl
      const normdiff = this.tradesRev(this.info.symbol).reduce((acc, trade) => acc + trade.normch, 0)
      const aval = misc.pos * this.priceCurrent.price

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
          avgh_pp: avgh / bt * 100,
          rating: this.rating(pldiff, normdiff),
          rpnl_pp: misc.rpnl / bt * 100,
          upnl_pp: misc.upnl / bt * 100,
          aval: aval,
          aval_pp: aval / bt * 100
        })
    }
  },
  methods: {
    rating (pldiff, normdiff) {
      if (pldiff > 0) {
        if (normdiff > pldiff) return 'A'
        else if (normdiff > 0 && normdiff < pldiff) return 'B'
        return 'C'
      } else if (normdiff > 0) {
        if (normdiff > -pldiff) return 'B'
        return 'D'
      }
      return 'E'
    }
  }
}
</script>
