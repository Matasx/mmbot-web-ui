<template>
  <b-container>
    <h1>Dashboard</h1>
    <b-button-toolbar class="mb-2">
      <b-button v-b-toggle.settings-collapse class="mx-1" size="sm" variant="link"><fa-icon icon="sliders-h"/></b-button>
      <b-form-checkbox v-model="showDetails" switch class="mt-1">
        Show details
      </b-form-checkbox>
    </b-button-toolbar>
    <b-collapse id="settings-collapse" class="mb-2">
      <b-card title="Display settings">
        <dashboard-settings/>
        <div>
          <b-button v-b-toggle.settings-collapse size="sm" class="mt-2" variant="danger">Close</b-button>
        </div>
      </b-card>
    </b-collapse>
    <b-card-group columns>
      <card v-for="info in infos" :key="info.symbol" :info="info" :show-details="showDetails" />
    </b-card-group>
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Card from '@/components/Card.vue'
import DashboardSettings from '@/components/DashboardSettings.vue'
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
    Card,
    DashboardSettings
  }
}
</script>
