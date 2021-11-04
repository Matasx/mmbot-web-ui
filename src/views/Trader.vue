<template>
  <b-container>
    <h1>{{ localInfo.title }}</h1>
    <card style="max-width: 500px" class="mb-3" :info="localInfo" show-details />
    <crypto-chart v-for="[key, settings] in charts" :key="key" class="pb-4"
      :info="localInfo"
      :y-title="settings.yTitle"
      :y-value="settings.value"
      :y-unit="settings.unit"
      :y-value-secondary="settings.secondaryValue"
      :y-title-secondary="settings.secondaryTitle"
      :chart-title="settings.title"
      :chart-title-symbol="false"
    />
    <trades-table-modern :trader-filter="filter" />
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import chartVariants from '@/data/charts'
import Card from '@/components/Card.vue'
import CryptoChart from '@/components/CryptoChart.vue'
import TradesTableModern from '@/components/TradesTableModern.vue'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'Trader',
  data () {
    return {
      symbol: this.$route.params.symbol
    }
  },
  components: {
    Card,
    CryptoChart,
    TradesTableModern
  },
  computed: {
    ...mapGetters(['info']),
    localInfo () {
      return this.info(this.symbol)
    },
    filter () {
      return [this.symbol]
    },
    charts () {
      return Object.entries(chartVariants)
    }
  },
  watch: {
    $route (to) {
      this.symbol = to.params.symbol
    }
  }
}
</script>
