<template>
  <b-container fluid="xl">
    <h1>Trades</h1>
    <trader-filter v-model="filter"/>
    <trades-table :settings="settings" :trader-filter="filter" />
  </b-container>
</template>

<script>
import TradesTable from '@/components/TradesTable.vue'
import TraderFilter from '@/components/TraderFilter.vue'

export default {
  name: 'Trades',
  data () {
    return {
      filter: [],
      settings: {
        show: true,
        modern: false
      }
    }
  },
  components: {
    TradesTable,
    TraderFilter
  }
}
</script>
