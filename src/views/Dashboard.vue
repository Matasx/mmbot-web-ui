<template>
  <b-container>
    <h1>Dashboard</h1>
    <crypto-chart v-for="info in infos" :key="info.symbol" :info="info" class="pb-4"/>
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import CryptoChart from '@/components/CryptoChart.vue'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'Home',
  components: { CryptoChart },
  computed: {
    ...mapGetters(['infos'])
  }
}
</script>
