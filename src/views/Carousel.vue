<template>
  <b-container fluid="xl">
    <h1>Activity</h1>
    <b-carousel
      :interval="5000"
      controls
      indicators
      img-width="1024"
      img-height="480"
    >
      <b-carousel-slide v-for="info in filteredInfos" :key="info.symbol" :caption="info.title" text="asd" img-blank img-alt="Blank image">
        <card :info="info" show-link/>
      </b-carousel-slide>
    </b-carousel>
  </b-container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Card from '@/components/Card.vue'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  components: { Card },
  name: 'Carousel',
  computed: {
    ...mapGetters(['infos']),
    filteredInfos () {
      if (this.infos.length > 0) {
        // todo: based on last trade, traders in 4 hrs? configurable?
        // todo: show some numbers from the last trade
        // todo: show chart
        // todo: attempt to evaluate performance
        return this.infos // [this.infos[0]]
      }
      return this.infos
    }
  }
}
</script>
