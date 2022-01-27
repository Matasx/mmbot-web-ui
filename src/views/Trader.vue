<template>
  <b-container>
    <div v-if="localInfo">
      <h1><broker-name :info="localInfo"/></h1>
      <b-button-toolbar class="mb-2">
        <b-button v-b-toggle.settings-collapse class="mx-1" size="sm" variant="link"><fa-icon icon="sliders-h"/></b-button>
      </b-button-toolbar>
      <b-collapse id="settings-collapse" class="mb-2">
        <b-card title="Display settings">
          <trader-settings/>
          <div>
            <b-button v-b-toggle.settings-collapse size="sm" class="mt-2" variant="danger">Close</b-button>
          </div>
        </b-card>
      </b-collapse>
      <trader-stats :info="localInfo"/>
      <h2>Charts</h2>
      <crypto-chart v-for="[key, settings] in charts" :key="key" class="pb-2"
        :info="localInfo"
        :source-name="settings.sourceName"
        :chart-type="settings.type"
        :y-title="settings.yTitle"
        :y-value="settings.value"
        :y-unit="settings.unit"
        :y-value-secondary="settings.secondaryValue"
        :y-title-secondary="settings.secondaryTitle"
        :chart-title="settings.title"
        :chart-title-symbol="false"
        :flip-order-titles="settings.flipOrderTitles"
      />
      <h2>Transactions</h2>
      <trades-table :settings="traderSettings.tradesSettings" :trader-filter="filter" />
    </div>
    <div v-else>
      <h1 class="text-danger mt-5"><fa-icon icon="dizzy" class="mb-2"/> Trader with ID '{{ symbol }}' was not found!</h1>
    </div>
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import TraderSettings from '@/components/settings/TraderSettings.vue'
import chartVariants from '@/data/charts'
import TraderStats from '@/components/TraderStats.vue'
import CryptoChart from '@/components/CryptoChart.vue'
import TradesTable from '@/components/TradesTable.vue'
import BrokerName from '@/components/BrokerName.vue'

const events = createNamespacedHelpers('events')
const settings = createNamespacedHelpers('settings')

export default {
  name: 'Trader',
  data () {
    return {
      symbol: this.$route.params.symbol
    }
  },
  components: {
    TraderStats,
    CryptoChart,
    TradesTable,
    TraderSettings,
    BrokerName
  },
  computed: {
    ...events.mapGetters(['info']),
    ...settings.mapGetters(['traderSettings']),
    localInfo () {
      return this.info(this.symbol)
    },
    filter () {
      return [this.symbol]
    },
    charts () {
      const cfg = this.traderSettings.chartSettings
      if (cfg.showAll) {
        return Object.entries(chartVariants)
      }
      return cfg.filter
        .map(key => ([key, chartVariants[key]]))
        .filter(([_, value]) => value)
        .sort(([_, a], [__, b]) => a.order - b.order)
    }
  },
  watch: {
    $route (to) {
      this.symbol = to.params.symbol
    }
  }
}
</script>
