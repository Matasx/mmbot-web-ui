<template>
  <b-container>
    <h1>Settings</h1>
    <pn-l-picker v-model="local.pnlType"/>
    <h2>Export / import</h2>
    <settings-exporter/>
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { SETTINGS_GLOBAL_SETTINGS_SET } from '@/store/actions/settings'
import SettingsExporter from '@/components/settings/SettingsExporter.vue'
import PnLPicker from '@/components/settings/PnLPicker.vue'

const { mapGetters, mapMutations } = createNamespacedHelpers('settings')

export default {
  name: 'Settings',
  components: {
    SettingsExporter,
    PnLPicker
  },
  data () {
    return {
      local: {}
    }
  },
  created () {
    this.readSettings()
  },
  watch: {
    local: {
      handler (newSettings) {
        const copy = JSON.parse(JSON.stringify(newSettings))
        this.setGlobalSettings(copy)
      },
      deep: true
    },
    globalSettings () {
      this.readSettings()
    }
  },
  computed: {
    ...mapGetters(['globalSettings'])
  },
  methods: {
    ...mapMutations({
      setGlobalSettings: SETTINGS_GLOBAL_SETTINGS_SET
    }),
    readSettings () {
      const persistedSettings = JSON.stringify(this.globalSettings)
      const localSettings = JSON.stringify(this.local)
      if (persistedSettings !== localSettings) {
        this.local = JSON.parse(persistedSettings)
      }
    }
  }
}
</script>
