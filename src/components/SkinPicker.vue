<template>
  <b-nav-item-dropdown text="Theme" right>
    <b-dropdown-item @click="selectTheme('dark')">Dark</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('cyborg')">Cyborg (dark)</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('cosmo')">Cosmo</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('flatly')">Flatly</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('litera')">Litera</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('lumen')">Lumen</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('pulse')">Pulse</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('sandstone')">Sandstone</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('simplex')">Simplex</b-dropdown-item>
    <b-dropdown-item @click="selectTheme('yeti')">Yeti</b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { SETTINGS_THEME_SET } from '@/store/actions/settings'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('settings')

export default {
  name: 'SkinPicker',
  mounted () {
    this.applyTheme()
  },
  computed: {
    ...mapGetters(['theme'])
  },
  methods: {
    ...mapMutations({
      persistTheme: SETTINGS_THEME_SET
    }),
    applyTheme () {
      document.documentElement.className = this.theme
    },
    selectTheme (theme) {
      this.persistTheme(theme + '_skin')
      this.applyTheme()
    }
  }
}
</script>
