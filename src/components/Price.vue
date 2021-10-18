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
    },
    addSymbol: {
      type: Boolean,
      default: true
    },
    allowMicro: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    compressed () {
      const result = format.autoFormat(this.value, this.addSign, this.allowMicro)
      return this.addSymbol ? result + ' ' + this.currencyInfo.symbol : result
    },
    verbose () {
      return this.addSymbol ? this.value + ' ' + this.currencyInfo.name : this.value
    }
  }
}
</script>
