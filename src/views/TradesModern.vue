<template>
  <b-container>
    <h1>Trades</h1>
    <trader-filter v-model="filter"/>
    <trades-table-modern :trader-filter="filter"/>
  </b-container>
</template>

<script>
import TradesTableModern from '@/components/TradesTableModern.vue'
import TraderFilter from '@/components/TraderFilter.vue'

export default {
  name: 'TradesModern',
  data () {
    return {
      filter: []
    }
  },
  components: {
    TradesTableModern,
    TraderFilter
  }
}
</script>
