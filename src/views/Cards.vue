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
import { SETTINGS_DASHBOARD_DETAILS_SET } from '@/store/actions/settings'

const events = createNamespacedHelpers('events')
const settings = createNamespacedHelpers('settings')

export default {
  name: 'Cards',
  computed: {
    ...events.mapGetters(['infos']),
    ...settings.mapGetters(['dashboardDetails']),
    showDetails: {
      get () { return this.dashboardDetails },
      set (value) { this.setDetails(value) }
    }
  },
  methods: {
    ...settings.mapMutations({
      setDetails: SETTINGS_DASHBOARD_DETAILS_SET
    })
  },
  components: {
    Card
  }
}
</script>
