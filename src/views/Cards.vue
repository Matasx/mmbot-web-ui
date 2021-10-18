<template>
  <b-container>
    <h1>Dashboard</h1>
    <b-form-checkbox v-model="showDetails" switch>
      Show details
    </b-form-checkbox>
    <b-card-group columns class="mt-2">
      <card v-for="info in infos" :key="info.symbol" :info="info" :show-details="showDetails" />
    </b-card-group>
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Card from '@/components/Card.vue'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'Cards',
  data () {
    return {
      showDetails: false
    }
  },
  computed: {
    ...mapGetters(['infos'])
  },
  components: {
    Card
  }
}
</script>
