<template>
  <b-img v-if="entry" width="32" :src="getSrc(entry)" :alt="entry.name" v-b-tooltip.top :title="entry.name"></b-img>
  <b-img v-else width="32" src="crypto/unknown.png" :alt="symbol" v-b-tooltip.top :title="symbol"></b-img>
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
  },
  methods: {
    getSrc (entry) {
      return 'crypto/' + (entry.image ?? entry.symbol.toLowerCase()) + '.png'
    }
  }
}
</script>
