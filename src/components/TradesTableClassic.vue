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
      :tbody-tr-class="rowClass"
      primary-key="key">
      <template #cell(icon)="data">
        <fa-icon v-if="data.item.alert" icon="exclamation-triangle" v-b-tooltip.top="'Alert'" />
        <fa-icon v-else-if="data.item.buy" icon="arrow-left" variant="danger" :style="{ color: '#6a994e' }" v-b-tooltip.top="'Buy'"/>
        <fa-icon v-else icon="arrow-right" :style="{ color: '#bc4749' }" v-b-tooltip.top="'Sell'"/>
      </template>
      <template #cell(symbol)="data">
        <span :set="itemInfo = info(data.item.symbol)">
          <b-img width="25" :src="$serviceUrl + itemInfo.brokerIcon" alt="Ex." v-b-tooltip.top="itemInfo.brokerName" class="mr-1"></b-img>
          <router-link :to="'/trader/' + itemInfo.symbol">{{ itemInfo.title }}</router-link>
        </span>
      </template>
      <template #cell(aachg)="data">
        <price v-if="!data.item.alert" :value="data.value" :currency-info="info(data.item.symbol).assetInfo" :add-symbol="false" title="Asset" />
      </template>
      <template #cell(price)="data">
        <price :value="data.value" :currency-info="info(data.item.symbol).currencyInfo" :add-symbol="false" title="Price" />
      </template>
      <template #cell(gain)="data">
        <price :value="data.value" :currency-info="info(data.item.symbol).currencyInfo" title="Profit or loss from position" :add-symbol="false" colored />
      </template>
      <template #cell(normch)="data">
        <price :value="data.value" :currency-info="info(data.item.symbol).currencyInfo" title="Normalized profit" :add-symbol="false" add-sign colored />
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
import Price from './Price.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'TradesTableClassic',
  components: { Price },
  data () {
    return {
      currentPage: 1,
      fields: [
        {
          key: 'time',
          label: 'Time',
          sortable: true,
          formatter: value => {
            return moment(value).format('D.M. HH:mm:ss')
          }
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
          key: 'aachg',
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
  },
  methods: {
    rowClass (item, type) {
      if (!item || type !== 'row') return
      if (item.man) return 'opacity-3'
    }
  }
}
</script>
