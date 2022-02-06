<template>
  <div>
    <label for="page-size">Page size: {{ local.pageSize }}</label>
    <b-form-input v-model="local.pageSize" id="page-size" type="range" min="3" max="100" number/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { SETTINGS_PERFORMANCE_SETTINGS_SET } from '@/store/actions/settings'

const { mapGetters, mapMutations } = createNamespacedHelpers('settings')

export default {
  name: 'PerformanceSettings',
  data () {
    return {
      local: {}
    }
  },
  created () {
    this.local = JSON.parse(JSON.stringify(this.performanceSettings))
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
    ...mapGetters(['performanceSettings'])
  },
  methods: {
    ...mapMutations({
      setDashboardSettings: SETTINGS_PERFORMANCE_SETTINGS_SET
    })
  }
}
</script>
