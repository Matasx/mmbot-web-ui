<template>
  <b-container>
    <h1>Trades</h1>
    <trades-table-classic></trades-table-classic>
  </b-container>
</template>

<script>
import TradesTableClassic from '@/components/TradesTableClassic.vue'

export default {
  components: { TradesTableClassic }
}
</script>
