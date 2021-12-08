<template>
  <div class="sidebar-section">
    <span v-b-toggle:id="id" class="title nav-link">
      <fa-icon v-if="toggle" icon="caret-up" class="mb-1"/>
      <fa-icon v-else icon="caret-down" class="mb-1"/>
      {{ title }}
    </span>
    <b-collapse :id="id" v-model="toggle">
      <ul>
        <slot/>
      </ul>
    </b-collapse>
  </div>
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
