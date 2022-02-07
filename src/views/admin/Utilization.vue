<template>
  <b-container fluid="xl">
    <h1>CPU utilization</h1>
    <p class="lead">
      Shows utilization for each trader and total. If the utilization is higher than 100%, the performance of the program may be significantly reduced. In this case, consider to start separate instance.<br />
      Note: Utilization is calculated from the total time spent in a single trader during the cycle. It consists of total CPU usage and API latency
    </p>
    <!-- TODO: API (reset) -->
    <!-- TODO: total -->
    <!-- TODO: respect order -->
    <div v-if="data">
      <div v-for="([symbol, v]) in Object.entries(data.traders)" :key="symbol" class="row pt-1">
        <div class="col-sm-4"><broker-name :info="info(symbol)" navigation /></div>
        <div class="col-sm-5 pt-1">
          <b-progress :value="v" :max="60000" :precision="2" variant="info"></b-progress>
        </div>
        <div class="col-sm-2">{{ (v / 600).toFixed(2) }} %</div>
      </div>
    </div>
    <b-skeleton-wrapper v-else loading>
      <template #loading>
          <b-skeleton width="85%"></b-skeleton>
          <b-skeleton width="55%"></b-skeleton>
          <b-skeleton width="70%"></b-skeleton>
      </template>
    </b-skeleton-wrapper>
  </b-container>
</template>

<script>
import BrokerName from '@/components/BrokerName.vue'
import axios from 'axios'
import { createNamespacedHelpers } from 'vuex'
import { AUTH_CHECK } from '@/store/actions/auth'
const auth = createNamespacedHelpers('auth')
const events = createNamespacedHelpers('events')

export default {
  name: 'Utilization',
  data () {
    return {
      data: null,
      intervalId: null
    }
  },
  components: {
    BrokerName
  },
  computed: {
    ...events.mapGetters(['info'])
  },
  methods: {
    ...auth.mapActions({
      authCheck: AUTH_CHECK
    }),
    async fetchData () {
      try {
        const response = await axios.get('admin/api/utilization')
        if (response.data && (!this.data || this.data.last_update !== response.data.last_update)) {
          this.data = response.data
        }
      } catch {
        await this.authCheck(true)
      }
    },
    async startLoop () {
      this.endLoop()
      try {
        await this.fetchData()
      } finally {
        this.intervalId = setInterval(this.fetchData, 5000)
      }
    },
    endLoop () {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    }
  },
  async created () {
    await this.startLoop()
  },
  beforeDestroy () {
    this.endLoop()
  }
}
</script>
