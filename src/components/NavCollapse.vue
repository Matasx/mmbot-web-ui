<template>
  <b-nav-text>
    <span v-b-toggle:id="id" class="ml-1">
      <fa-icon v-if="toggle" icon="caret-up" class="mb-1"/>
      <fa-icon v-else icon="caret-down" class="mb-1"/>
      {{ title }}
    </span>
    <b-collapse :id="id" v-model="toggle" class="ml-3">
      <b-navbar-nav>
        <slot/>
      </b-navbar-nav>
    </b-collapse>
  </b-nav-text>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { SETTINGS_MENU_TOGGLE_SET } from '@/store/actions/settings'

const { mapGetters, mapMutations } = createNamespacedHelpers('settings')

export default {
  name: 'NavCollapse',
  props: {
    title: String,
    id: String
  },
  computed: {
    ...mapGetters(['menuToggle']),
    toggle: {
      get () { return this.menuToggle(this.id) },
      set (value) { this.setMenuToggle({ id: this.id, state: value }) }
    }
  },
  methods: {
    ...mapMutations({
      setMenuToggle: SETTINGS_MENU_TOGGLE_SET
    })
  }
}
</script>
