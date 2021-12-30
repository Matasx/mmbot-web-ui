<template>
  <b-container>
    <h1>Settings</h1>
    <pn-l-picker v-model="pnl"/>
    <h2>Export / import</h2>
    <settings-exporter/>
  </b-container>
</template>

<script>
import SettingsExporter from '@/components/settings/SettingsExporter.vue'
import PnLPicker from '@/components/settings/PnLPicker.vue'

export default {
  name: 'Settings',
  components: {
    SettingsExporter,
    PnLPicker
  },
  data () {
    return {
      pnl: 0
    }
  }
}
</script>
