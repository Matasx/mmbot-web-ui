<template>
  <div>
    <h6>Trader filter</h6>
    <b-form-checkbox v-model="local.traderFilter" switch>Show</b-form-checkbox>
    <h6 class="mt-2">Card details</h6>
    <b-form-checkbox v-model="local.avgPlPosition" switch>Avg. P/L position</b-form-checkbox>
    <b-form-checkbox v-model="local.avgPlNorm" switch>Avg. income norm</b-form-checkbox>
    <h6 class="mt-2">Trades</h6>
    <b-form-checkbox v-model="local.trades" switch>Show</b-form-checkbox>
    <b-form-checkbox v-model="local.tradesModern" :disabled="!local.trades" switch>Style: {{ local.tradesModern ? 'modern' : 'classic' }}</b-form-checkbox>
    <label for="page-size">Page size: {{ local.pageSize }}</label>
    <b-form-input v-model="local.pageSize" :disabled="!local.trades" id="page-size" type="range" min="3" max="100" number/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { SETTINGS_DASHBOARD_SETTINGS_SET } from '@/store/actions/settings'

const { mapGetters, mapMutations } = createNamespacedHelpers('settings')

export default {
  name: 'DashboardSettings',
  data () {
    return {
      local: {}
    }
  },
  created () {
    this.local = JSON.parse(JSON.stringify(this.dashboardSettings))
  },
  watch: {
    local: {
      handler (newSettings) {
        const copy = JSON.parse(JSON.stringify(newSettings))
        this.setDashboardSettings(copy)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['dashboardSettings'])
  },
  methods: {
    ...mapMutations({
      setDashboardSettings: SETTINGS_DASHBOARD_SETTINGS_SET
    })
  }
}
</script>
