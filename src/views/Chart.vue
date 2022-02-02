<template>
  <b-container fluid="xl">
    <h1>{{ settings.title }}</h1>
    <trader-filter v-model="filter"/>
    <crypto-chart v-for="info in filteredInfos" :key="info.symbol" class="pb-4"
      :info="info"
      :source-name="settings.sourceName"
      :chart-type="settings.type"
      :y-title="settings.yTitle"
      :y-value="settings.value"
      :y-unit="settings.unit"
      :y-value-secondary="settings.secondaryValue"
      :y-title-secondary="settings.secondaryTitle"
      :chart-title="settings.title"
      :flip-order-titles="settings.flipOrderTitles"
      :loaded="loaded"
    />
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import chartVariants from '@/data/charts'

import CryptoChart from '@/components/CryptoChart.vue'
import TraderFilter from '@/components/TraderFilter.vue'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'Chart',
  components: {
    CryptoChart,
    TraderFilter
  },
  data () {
    return { // todo: local configuration (enable filter)
      settings: this.getSettings(this.$route.params.type),
      filter: [],
      loaded: false
    }
  },
  computed: {
    ...mapGetters(['infos']),
    filteredInfos () {
      if (this.filter.length > 0) {
        return this.infos.filter(info => this.filter.includes(info.symbol))
      }
      return this.infos
    }
  },
  methods: {
    getSettings (type) {
      return chartVariants[type] ?? chartVariants.price
    },
    setLoaded () {
      if (!this.loaded) {
        setTimeout(() => { this.loaded = true }, 1)
      }
    }
  },
  watch: {
    $route (to) {
      this.loaded = false
      this.settings = this.getSettings(to.params.type)
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
