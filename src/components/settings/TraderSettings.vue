<template>
  <div>
    <h6>Charts</h6>
    <b-form-checkbox v-model="local.chartSettings.showAll" switch>Show all chart types</b-form-checkbox>
    <b-form-group v-if="!local.chartSettings.showAll" v-slot="{ ariaDescribedby }" class="ml-3">
      <b-form-checkbox-group
        v-model="local.chartSettings.filter"
        :options="chartOptions"
        :aria-describedby="ariaDescribedby"
        switches
        name="button-filter"
        stacked
      />
    </b-form-group>
    <h6 class="mt-2">Trades</h6>
    <trades-settings v-model="local.tradesSettings"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { SETTINGS_TRADER_SETTINGS_SET } from '@/store/actions/settings'
import TradesSettings from '@/components/settings/TradesSettings.vue'
import chartVariants from '@/data/charts'

const { mapGetters, mapMutations } = createNamespacedHelpers('settings')

export default {
  components: { TradesSettings },
  name: 'TraderSettings',
  data () {
    return {
      local: {}
    }
  },
  created () {
    this.local = JSON.parse(JSON.stringify(this.traderSettings))
  },
  watch: {
    local: {
      handler (newSettings) {
        const copy = JSON.parse(JSON.stringify(newSettings))
        this.setTraderSettings(copy)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['traderSettings']),
    chartOptions () {
      return Object.entries(chartVariants).map(([key, variant]) => ({ text: variant.title, value: key }))
    }
  },
  methods: {
    ...mapMutations({
      setTraderSettings: SETTINGS_TRADER_SETTINGS_SET
    })
  }
}
</script>
