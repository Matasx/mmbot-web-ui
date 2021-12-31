<template>
  <span :hidden="hidden" v-if="colored" v-b-tooltip.top.html="fullTitle" :class="[ value < 0 ? 'text-danger' : 'text-success' ]">{{ compressed }}</span>
  <span :hidden="hidden" v-else v-b-tooltip.top.html="fullTitle">{{ compressed }}</span>
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
    },
    colored: {
      type: Boolean,
      default: false
    },
    hideZero: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fullTitle () {
      const value = this.compressTitle ? this.compressed : this.verbose
      return this.title ? '<b>' + this.title + ':</b><br />' + value : value
    },
    compressed () {
      const result = format.autoFormat(this.value, this.addSign, this.allowMicro)
      return this.addSymbol ? result + ' ' + this.currencyInfo.symbol : result
    },
    verbose () {
      return this.value + ' ' + (this.addSymbol ? this.currencyInfo.name : this.currencyInfo.symbol)
    },
    hidden () {
      return this.hideZero && this.value === 0
    }
  }
}
</script>
