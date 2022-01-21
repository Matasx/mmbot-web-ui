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
      <template #cell(time)="data">
        <span class="text-nowrap">{{ data.value }}</span>
      </template>
      <template #cell(symbol)="data">
        <span :set="itemInfo = info(data.item.symbol)" class="text-nowrap">
          <!-- Temporary fix for trainer - remove icon -->
          <b-img v-if="!itemInfo.emulated" width="25" :src="$serviceUrl + itemInfo.brokerIcon" alt="Ex." v-b-tooltip.top="itemInfo.brokerName" class="mr-1"></b-img>
          <router-link :to="'/trader/' + itemInfo.symbol">{{ itemInfo.title }}</router-link>
        </span>
      </template>
      <template #cell(icon)="data">
        <fa-icon v-if="data.item.alert" icon="exclamation-triangle" v-b-tooltip.top.html="alertText(data)" />
        <fa-icon v-else-if="data.item.buy" icon="arrow-left" variant="danger" :style="{ color: '#6a994e' }" v-b-tooltip.top="'Buy'"/>
        <fa-icon v-else icon="arrow-right" :style="{ color: '#bc4749' }" v-b-tooltip.top="'Sell'"/>
      </template>
      <template #cell(aachg)="data">
        <price v-if="!data.item.alert" :value="data.value" :currency-info="info(data.item.symbol).assetInfo" :add-symbol="false" title="Asset" />
      </template>
      <template #cell(price)="data">
        <price :value="data.value" :currency-info="info(data.item.symbol).currencyInfo" :add-symbol="false" title="Price" />
      </template>
      <template #cell(plDiff)="data">
        <price :value="data.value" :currency-info="info(data.item.symbol).currencyInfo" title="Equity change" :add-symbol="false" colored />
      </template>
      <template #cell(rplDiff)="data">
        <price :value="data.value" :currency-info="info(data.item.symbol).currencyInfo" title="ACB" hide-zero :add-symbol="false" colored />
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
import alerts from '@/data/alerts'

const { mapGetters: mapEventGetters } = createNamespacedHelpers('events')
const { mapGetters: mapSettingsGetters } = createNamespacedHelpers('settings')

export default {
  name: 'TradesTableClassic',
  components: { Price },
  data () {
    return {
      currentPage: 1
    }
  },
  props: {
    traderFilter: {
      type: Array,
      default () { return [] }
    },
    typeFilter: {
      type: Array,
      default () { return [] }
    },
    pageSize: {
      type: Number,
      default: 20
    }
  },
  computed: {
    fields () {
      return [
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
          key: this.globalSettings.pnlType === 1 ? 'rplDiff' : 'plDiff',
          label: 'P/L',
          sortable: true
        },
        {
          key: 'normch',
          label: 'norm. P/L',
          sortable: true
        }
      ]
    },
    filteredRows () {
      return this.filtered.length
    },
    filtered () {
      let prefiltered
      if (this.traderFilter.length > 0) {
        prefiltered = this.traderFilter.flatMap(filter => this.trades(filter))
      } else {
        prefiltered = this.tradesFlat
      }

      const alert = this.typeFilter.includes('alert')
      const buy = this.typeFilter.includes('buy')
      const sell = this.typeFilter.includes('sell')
      return prefiltered.filter(t => (buy && t.buy) || (sell && !t.buy) || (alert && t.alert))
    },
    ...mapEventGetters(['trades', 'tradesFlat', 'info']),
    ...mapSettingsGetters(['globalSettings'])
  },
  methods: {
    rowClass (item, type) {
      if (!item || type !== 'row') return
      if (item.man) return 'opacity-3'
    },
    alertText (data) {
      if (!data.item.alertObj) return 'Alert'
      return '<b>Alert:</b><br/>' + alerts.lookup(data.item.alertObj.reason)[0]
    }
  }
}
</script>
