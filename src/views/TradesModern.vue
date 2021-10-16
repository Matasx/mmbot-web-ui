<template>
  <b-container>
    <h1>Trades</h1>
    <trades-table-modern></trades-table-modern>
  </b-container>
</template>

<script>
import TradesTableModern from '@/components/TradesTableModern.vue'

export default {
  components: { TradesTableModern }
}
</script>
