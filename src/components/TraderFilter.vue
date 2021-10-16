<template>
  <b-form-group v-slot="{ ariaDescribedby }">
    <b-form-checkbox-group
      v-model="localState"
      :options="filterOptions"
      :aria-describedby="ariaDescribedby"
      switches
      name="button-filter"/>
  </b-form-group>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'TraderFilter',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  computed: {
    localState: {
      get () { return this.value },
      set (value) { this.$emit('input', value) }
    },
    filterOptions () {
      return this.infos.map(info => ({ text: info.title, value: info.symbol }))
    },
    ...mapGetters(['infos'])
  }
}
</script>
