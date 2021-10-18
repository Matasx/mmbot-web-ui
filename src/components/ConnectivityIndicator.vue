<template>
  <b-nav-item id="connectivity">
    <fa-icon v-if="isConnected" icon="wifi"/>
    <fa-icon v-else icon="sync-alt" class="text-danger" spin/>
    <b-popover target="connectivity" triggers="hover" placement="bottom" variant="secondary">
      <template #title>Last update</template>
      {{ timeDiffSec }}s ago
    </b-popover>
  </b-nav-item>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'ConnectivityIndicator',
  data () {
    return {
      currentTime: 0
    }
  },
  mounted () {
    window.setInterval(() => {
      this.updateCurrentTime()
    }, 1000)
  },
  computed: {
    ...mapGetters(['lastEventTime']),
    timeDiffSec () {
      return (this.timeDiff / 1000).toFixed(0)
    },
    timeDiff () {
      return Math.max(this.currentTime - this.lastEventTime, 0)
    },
    isConnected () {
      return this.timeDiff < 70000
    }
  },
  methods: {
    updateCurrentTime () {
      this.currentTime = Date.now()
    }
  }
}
</script>
