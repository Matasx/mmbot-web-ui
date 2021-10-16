<template>
  <span v-b-tooltip.top :title="verbose">{{ compressed }}</span>
</template>

<script>
import format from '@/utils/format'

export default {
  props: {
    value: Number,
    currencyInfo: Object,
    addSign: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    compressed () {
      return format.autoFormat(this.value, this.addSign) + ' ' + this.currencyInfo.symbol
    },
    verbose () {
      return this.value + ' ' + this.currencyInfo.name
    }
  }
}
</script>
