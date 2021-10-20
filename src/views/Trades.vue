<template>
  <b-container>
    <h1>Trades</h1>
    <trader-filter v-model="filter"/>
    <trades-table-classic :trader-filter="filter"/>
  </b-container>
</template>

<script>
import TradesTableClassic from '@/components/TradesTableClassic.vue'
import TraderFilter from '@/components/TraderFilter.vue'

export default {
  data () {
    return {
      filter: []
    }
  },
  components: {
    TradesTableClassic,
    TraderFilter
  }
}
</script>
