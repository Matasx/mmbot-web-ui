<template>
  <b-container fluid="xl">
    <h1>Performance by currency</h1>
    <crypto-chart-stacked v-for="[currency, info] in currencyGroups" :key="currency" class="pb-4"
      :infos="info"
      :chart-title="currency"
      :loaded="loaded"
      y-title="P&amp;L"
      y-value="pl"
    />
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import CryptoChartStacked from '@/components/CryptoChartStacked.vue'

const { mapGetters } = createNamespacedHelpers('events')

const groupBy = function (xs, selector) {
  return xs.reduce((rv, x) => {
    const key = selector(x);
    (rv[key] = rv[key] || []).push(x)
    return rv
  }, {})
}

export default {
  name: 'ChartByCurrency',
  components: {
    CryptoChartStacked
  },
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters(['infos']),
    currencyGroups () {
      // todo: filter out disabled by misc
      // todo: respect P&L type
      // todo: option to hide simulators
      return Object.entries(groupBy(this.infos, i => i.currency))
    }
  },
  methods: {
    setLoaded () {
      if (!this.loaded) {
        setTimeout(() => { this.loaded = true }, 1)
      }
    }
  },
  watch: {
    $route () {
      this.loaded = false
    }
  },
  mounted () {
    this.setLoaded()
  },
  updated () {
    this.setLoaded()
  }
}
</script>
