<template>
  <div>
    <!-- TODO: per chart visibility configuration -->
    <h6 class="mt-2">Trades</h6>
    <trades-settings v-model="local.tradesSettings"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { SETTINGS_TRADER_SETTINGS_SET } from '@/store/actions/settings'
import TradesSettings from '@/components/settings/TradesSettings.vue'

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
    ...mapGetters(['traderSettings'])
  },
  methods: {
    ...mapMutations({
      setTraderSettings: SETTINGS_TRADER_SETTINGS_SET
    })
  }
}
</script>
