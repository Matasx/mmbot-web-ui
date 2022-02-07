<template>
  <b-container fluid="xl">
    <h1>CPU utilization</h1>
    <p v-if="data">
      {{ data }}
    </p>
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
import axios from 'axios'
import { createNamespacedHelpers } from 'vuex'
import { AUTH_CHECK } from '@/store/actions/auth'
const auth = createNamespacedHelpers('auth')

export default {
  name: 'Utilization',
  data () {
    return {
      data: null,
      intervalId: null
    }
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
