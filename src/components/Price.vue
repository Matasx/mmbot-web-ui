<template>
  <span v-b-tooltip.top.html="fullTitle">{{ compressed }}</span>
</template>

<script>
import format from '@/utils/format'

export default {
  props: {
    value: Number,
    currencyInfo: Object,
    title: {
      type: String,
      default: null
    },
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
    },
    compressTitle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fullTitle () {
      const value = this.compressTitle ? this.compressed : this.verbose
      return this.title ? this.title + ':<br />' + value : value
    },
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
