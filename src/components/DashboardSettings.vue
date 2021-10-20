<template>
  <div>
    <b-form-checkbox v-model="local.avgPlPosition" switch>Avg. P/L position</b-form-checkbox>
    <b-form-checkbox v-model="local.avgPlNorm" switch>Avg. income norm</b-form-checkbox>
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
