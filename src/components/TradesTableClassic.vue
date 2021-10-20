<template>
  <div>
    <b-table
      id="orders"
      striped
      hover
      responsive="lg"
      sort-by="time"
      sort-desc
      :per-page="pageSize"
      :current-page="currentPage"
      :items="filtered"
      :fields="fields"
      primary-key="key">
      <template #cell(icon)="data">
        <fa-icon v-if="data.item.alert" icon="exclamation-triangle"/>
        <fa-icon v-else-if="data.item.buy" icon="arrow-right" :style="{ color: '#6a994e' }"/>
        <fa-icon v-else icon="arrow-left" variant="danger" :style="{ color: '#bc4749' }"/>
      </template>
      <template #cell(broker_icon)="data">
        <b-img width="25" :src="$serviceUrl + info(data.item.symbol).brokerIcon" alt="Ex."></b-img>
      </template>
      <template #cell(normch)="data">
        <b :class="[ data.item.normch < 0 ? 'text-danger' : 'text-success' ]">{{ data.item.normch }}</b>
      </template>
    </b-table>
    <b-pagination
      limit="9"
      first-number
      last-number
      align="fill"
      aria-controls="orders"
      v-model="currentPage"
      :total-rows="filteredRows"
      :per-page="pageSize">
    </b-pagination>
  </div>
</template>

<script>
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'TradesTableClassic',
  data () {
    return {
      currentPage: 1,
      fields: [
        {
          key: 'time',
          label: 'Time',
          sortable: true,
          formatter: value => {
            return moment(value).format('L HH:mm:ss')
          }
        },
        {
          key: 'broker_icon',
          label: ''
        },
        {
          key: 'symbol',
          label: 'Pair',
          sortable: true,
          sortByFormatted: true,
          formatter: value => {
            return this.info(value).title
          }
        },
        {
          key: 'icon',
          label: ''
        },
        {
          key: 'achg',
          label: 'Size',
          sortable: true
        },
        {
          key: 'price',
          label: 'Price',
          sortable: true
        },
        {
          key: 'gain',
          label: 'P/L',
          sortable: true
        },
        {
          key: 'normch',
          label: 'norm. P/L',
          sortable: true
        }
      ]
    }
  },
  props: {
    traderFilter: {
      type: Array,
      default () { return [] }
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  computed: {
    filteredRows () {
      return this.filtered.length
    },
    filtered () {
      if (this.traderFilter.length > 0) {
        return this.traderFilter.flatMap(filter => this.trades(filter))
      }
      return this.tradesFlat
    },
    ...mapGetters(['trades', 'tradesFlat', 'info'])
  }
}
</script>
