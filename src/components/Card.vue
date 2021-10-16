<template>
  <b-card no-body border-variant="success" align="center">
    <b-card-header>
      <b-img width="32" :src="$serviceUrl + info.brokerIcon" alt="Ex."></b-img> {{ info.title }} <span class="text-info">pos: <price :value="perf.pos" :currency-info="info.assetInfo" /></span>
      <b-progress class="mt-2" :max="100">
        <b-progress-bar :value="30" variant="success"></b-progress-bar>
        <b-progress-bar :value="20" variant="primary"></b-progress-bar>
        <b-progress-bar :value="2" variant="info"></b-progress-bar>
        <b-progress-bar :value="18" variant="primary"></b-progress-bar>
        <b-progress-bar :value="30" variant="danger">asd</b-progress-bar>
      </b-progress>
    </b-card-header>
    <b-card-body>
      <b-card-text>{{ perf.data }}</b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Price from './Price.vue'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'Card',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  components: {
    Price
  },
  computed: {
    ...mapGetters(['misc']),
    perf () {
      return this.misc(this.info.symbol)
    }
  }
}
</script>
