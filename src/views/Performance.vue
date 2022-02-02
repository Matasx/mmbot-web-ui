<template>
  <b-container fluid="xl">
    <h1>Daily performance</h1>
    <b-table-simple hover small responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th v-for="header in performance.hdr" :key="header" class="text-center">{{ header }}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr v-for="(row, index) in performance.rows" :key="index">
          <b-td v-for="(cell, index2) in row" :key="index2" class="text-center">
            <span v-if="index2 === 0">{{ cell | date }}</span>
            <price v-else :value="cell" :currency-info="infos[index2]" :add-symbol="false" colored hide-zero />
          </b-td>
        </b-tr>
      </b-tbody>
      <b-tfoot foot-variant="dark">
        <b-tr>
          <b-th class="text-center">∑</b-th>
          <b-th v-for="(sum, index) in performance.sums" :key="index" class="text-center">
            <price :value="sum" :currency-info="infos[index+1]" :add-symbol="false" colored hide-zero />
          </b-th>
        </b-tr>
      </b-tfoot>
    </b-table-simple>
  </b-container>
</template>

<script>
import moment from 'moment'
import Price from '@/components/Price.vue'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'Performance',
  components: {
    Price
  },
  computed: {
    ...mapGetters(['performance']),
    infos () {
      return this.performance.hdr.map(x => ({ symbol: x, name: x }))
    }
  },
  filters: {
    date (value) {
      return moment(value * 1000).format('DD.MM.YYYY')
    }
  }
}
</script>
