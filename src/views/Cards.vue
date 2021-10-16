<template>
  <b-container>
    <h1>Dashboard</h1>
    <b-card-group columns>
      <card v-for="info in infos" :key="info.symbol" :info="info" />
    </b-card-group>
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Card from '@/components/Card.vue'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'Cards',
  computed: {
    ...mapGetters(['infos'])
  },
  components: {
    Card
  }
}
</script>
