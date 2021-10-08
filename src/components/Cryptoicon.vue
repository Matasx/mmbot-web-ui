<template>
  <b-img v-if="entry" width="32" :src="'/crypto/' + entry.symbol + '.png'" :alt="entry.name" v-b-tooltip.top :title="entry.name"></b-img>
  <span v-else>{{ symbol }}</span>
</template>

<script>
import manifest from '@/data/cryptoicons'

export default {
  name: 'Cryptoicon',
  props: {
    symbol: String
  },
  computed: {
    entry () {
      return manifest[this.symbol.toUpperCase()]
    }
  }
}
</script>
