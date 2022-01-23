<template>
  <b-container>
    <h1>Debug</h1>
    <b-textarea ref="area" v-model="trade" rows="10" />
    <b-button class="mt-3" variant="danger" block @click="addTrade()">Add trade</b-button>
    <trader-filter v-model="filter"/>
    <trades-table :settings="settings" :trader-filter="filter" />
  </b-container>
</template>

<script>
import TradesTable from '@/components/TradesTable.vue'
import TraderFilter from '@/components/TraderFilter.vue'
import moment from 'moment'
import { EVENTS_BATCH } from '@/store/actions/events'
import { createNamespacedHelpers } from 'vuex'
import tradeHandler from '@/eventsource/handlers/trade'
const { mapMutations, mapGetters } = createNamespacedHelpers('events')
export default {
  name: 'Debug',
  data () {
    const sample = {
      data: {
        achg: -95.94521883,
        gain: 0.0004554530648,
        id: 123,
        man: false,
        norm: 0.017443932,
        normch: 5.144265423e-9,
        open: 0.00000533919899,
        p0: 0.000005906359106,
        pl: 0.00982398386,
        pos: 7511.12096288,
        price: 0.00000474,
        rpl: 0.014395703,
        time: moment().valueOf(),
        volume: 0.0004491420531
      },
      id: '1111',
      symbol: null,
      type: 'trade'
    }
    return {
      filter: [],
      settings: {
        show: true,
        modern: true
      },
      trade: JSON.stringify(sample, undefined, 2)
    }
  },
  components: {
    TradesTable,
    TraderFilter
  },
  computed: {
    ...mapGetters(['infos'])
  },
  methods: {
    ...mapMutations({
      commitBatch: EVENTS_BATCH
    }),
    addTrade () {
      const batch = {}
      tradeHandler.reset(batch)
      const trade = JSON.parse(this.trade)
      if (!trade.symbol) {
        trade.symbol = this.infos[0].symbol
      }
      tradeHandler.add(batch, tradeHandler.map(trade))
      this.commitBatch(batch)
    }
  }
}
</script>
