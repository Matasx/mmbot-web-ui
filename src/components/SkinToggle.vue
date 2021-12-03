<template>
  <b-nav-item @click="switchTheme()" v-if="isLightTheme" v-b-tooltip.bottom title="Switch to dark mode">🌙</b-nav-item>
  <b-nav-item @click="switchTheme()" v-else v-b-tooltip.bottom title="Switch to light mode">💡</b-nav-item>
</template>

<script>
import { SETTINGS_THEME_SET, LIGHT_SKIN, DARK_SKIN } from '@/store/actions/settings'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('settings')

export default {
  name: 'SkinToggle',
  mounted () {
    this.applyTheme()
  },
  computed: {
    ...mapGetters(['theme']),
    isLightTheme () {
      return this.theme === LIGHT_SKIN
    }
  },
  methods: {
    ...mapMutations({
      persistTheme: SETTINGS_THEME_SET
    }),
    applyTheme () {
      if (this.theme !== LIGHT_SKIN && this.theme !== DARK_SKIN) {
        this.persistTheme(LIGHT_SKIN)
      }
      document.documentElement.className = this.theme
    },
    switchTheme () {
      this.persistTheme(this.isLightTheme ? DARK_SKIN : LIGHT_SKIN)
      this.applyTheme()
    }
  },
  watch: {
    theme () {
      this.applyTheme()
    }
  }
}
</script>
