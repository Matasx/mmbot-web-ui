<template>
  <b-form-group label="P&amp;L type" v-slot="{ ariaDescribedby }">
    <b-form-radio-group
      v-model="selected"
      :options="options"
      :aria-describedby="ariaDescribedby"
      buttons
      button-variant="primary"
      size="sm"
    ></b-form-radio-group>
  </b-form-group>
</template>

<script>
export default {
  name: 'PnLPicker',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    selected: {
      get () { return this.value },
      set (value) { this.$emit('input', value) }
    }
  },
  data () {
    return {
      options: [
        { text: 'Normalized profit', value: 0 },
        { text: 'ACB', value: 1, disabled: true },
        { text: 'Equity change', value: 2, disabled: true }
      ]
    }
  }
}
</script>
