<template>
  <div>
    <order-slider :info="info" class="mb-2" style="max-width: 500px"/>
    <b-table-simple hover small responsive style="max-width: 500px">
      <b-tbody>
        <b-tr>
          <b-td>Type:</b-td>
          <b-td class="text-right">{{ info.emulated ? 'paper trader' : 'live trader' }}</b-td>
        </b-tr>
        <b-tr>
          <b-td>Rating:</b-td>
          <b-td class="text-right"><rating :rating="localStats.rating" class="mb-1"/> {{ localStats.rating }}</b-td>
        </b-tr>
        <b-tr>
          <b-td>Position:</b-td>
          <b-td class="text-right">
            <span v-if="localMisc.pos !== undefined">
              <price :value="localMisc.pos" :currency-info="info.assetInfo" :title="info.emulated ? 'Virtual position (trainer)' : 'Position'"/>
              <b-spinner v-if="achieve" small type="grow" class="ml-1 mb-1"/>
            </span>
          </b-td>
        </b-tr>
        <b-tr>
          <b-td>Value:</b-td>
          <b-td class="text-right"><price :value="localStats.aval" :currency-info="info.currencyInfo" title="Value of asset"/></b-td>
        </b-tr>
        <b-tr>
          <b-td>Enter price:</b-td>
          <b-td class="text-right"><price :value="localMisc.op" :currency-info="info.currencyInfo" title="Cost basis"/></b-td>
        </b-tr>
        <b-tr>
          <b-td>Total budget:</b-td>
          <b-td class="text-right"><price :value="localMisc.bt" :currency-info="info.currencyInfo" title="Total allocated budget"/></b-td>
        </b-tr>
        <b-tr v-if="localError.error">
          <b-td colspan="2" class="text-center text-danger">
            <fa-icon icon="burn" class="mr-2 mb-1"/>
            <em>{{ localError.error }}</em>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <h2>Statistics</h2>
    <b-table-simple hover small responsive>
      <b-tbody>
        <b-tr>
          <b-td>Realized P/L:</b-td>
          <b-th class="text-right"><price :value="localMisc.rpnl" :currency-info="info.currencyInfo" add-sign colored title="Total" /></b-th>
          <b-th class="text-right"><price :value="localStats.rpnl_pp" :currency-info="percentageInfo" compress-title add-sign colored :allow-micro="false" title="Total portion of budget" /></b-th>
        </b-tr>
        <b-tr>
          <b-td>Unrealized P/L:</b-td>
          <b-th class="text-right"><price :value="localMisc.upnl" :currency-info="info.currencyInfo" add-sign colored title="Total" /></b-th>
          <b-th class="text-right"><price :value="localStats.upnl_pp" :currency-info="percentageInfo" compress-title add-sign colored :allow-micro="false" title="Total portion of budget" /></b-th>
        </b-tr>
        <b-tr>
          <b-td>Avg. P/L position:</b-td>
          <b-th class="text-right"><price :value="localStats.avghpl" :currency-info="info.currencyInfo" add-sign colored title="Per year" />/y</b-th>
          <b-th class="text-right"><price :value="localStats.avghpl_pp" :currency-info="percentageInfo" compress-title add-sign colored :allow-micro="false" title="Per year" />/y</b-th>
        </b-tr>
        <b-tr>
          <b-td>Avg. income norm:</b-td>
          <b-th class="text-right"><price :value="localStats.avgh" :currency-info="info.currencyInfo" add-sign colored title="Per year" />/y</b-th>
          <b-th class="text-right"><price :value="localStats.avgh_pp" :currency-info="percentageInfo" compress-title add-sign colored :allow-micro="false" title="Per year" />/y</b-th>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Price from './Price.vue'
import OrderSlider from './OrderSlider.vue'
import Rating from './Rating.vue'
const { mapGetters } = createNamespacedHelpers('events')

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
    Rating
  },
  computed: {
    ...mapGetters(['misc', 'error', 'stats']),
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
    localStats () {
      return this.stats(this.info.symbol)
    },
    achieve () {
      return this.localMisc.a
    }
  }
}
</script>
