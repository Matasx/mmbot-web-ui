<template>
  <b-container fluid="xl">
    <h1>Daily performance</h1>
    <b-button-toolbar class="mb-2">
        <b-button v-b-toggle.settings-collapse class="mx-1" size="sm" variant="link"><fa-icon icon="sliders-h"/></b-button>
      </b-button-toolbar>
    <b-collapse id="settings-collapse" class="mb-2">
      <b-card title="Display settings">
        <performance-settings/>
        <div>
          <b-button v-b-toggle.settings-collapse size="sm" class="mt-2" variant="danger">Close</b-button>
        </div>
      </b-card>
    </b-collapse>
    <b-table-simple hover small responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th v-for="header in performance.hdr" :key="header" class="text-center">{{ header }}</b-th>
        </b-tr>
        <b-tr>
          <b-th class="text-center">∑ total</b-th>
          <b-th v-for="(sum, index) in performance.sums" :key="index" class="text-center">
            <price :value="sum" :currency-info="infos[index+1]" :add-symbol="false" colored hide-zero />
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <b-tr v-for="(row, index) in rowsPage" :key="index">
          <b-td v-for="(cell, index2) in row" :key="index2" class="text-center">
            <span v-if="index2 === 0">{{ cell | date }}</span>
            <price v-else :value="cell" :currency-info="infos[index2]" :add-symbol="false" colored hide-zero />
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
    <b-pagination
      limit="9"
      first-number
      last-number
      align="fill"
      v-model="currentPage"
      :total-rows="rowsCount"
      :per-page="pageSize"
      class="mt-2">
    </b-pagination>
  </b-container>
</template>

<script>
import moment from 'moment'
import Price from '@/components/Price.vue'
import PerformanceSettings from '@/components/settings/PerformanceSettings.vue'
import { createNamespacedHelpers } from 'vuex'

const events = createNamespacedHelpers('events')
const settings = createNamespacedHelpers('settings')

export default {
  name: 'Performance',
  components: {
    Price,
    PerformanceSettings
  },
  data () {
    return {
      currentPage: 1
    }
  },
  computed: {
    ...events.mapGetters(['performance', 'performanceRows']),
    ...settings.mapGetters(['performanceSettings']),
    infos () {
      return this.performance.hdr.map(x => ({ symbol: x, name: x }))
    },
    pageSize () {
      return this.performanceSettings.pageSize
    },
    rowsPage () {
      return this.performanceRows.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    rowsCount () {
      return this.performanceRows.length
    }
  },
  filters: {
    date (value) {
      return moment(value * 1000).format('DD.MM.YYYY')
    }
  }
}
</script>
