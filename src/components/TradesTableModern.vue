<template>
  <div>
    <b-container v-for="group in dataView" :key="group.key">
      <h5 class="mt-3">{{ group.key }}</h5>
      <b-list-group>
        <b-list-group-item :class="'row d-flex' + tradeClass(item.trade)" v-for="item in group.trades" :key="item.trade.key">
          <div class="col-4 col-md-2 p-0">
            <div class="media align-items-center">
              <b-img class="mr-3" width="32" :src="item.info.brokerIcon" alt="Ex." v-b-tooltip.top="item.info.brokerName"></b-img>
              <div class="media-body small-xs no-small-md">
                <router-link :to="'/trader/' + item.info.symbol" class="text-muted small text-uppercase">
                  {{ item.info.title }}
                </router-link>
                <div>
                  <span>
                    <span class="text-uppercase">{{ formatTime(item.trade.time) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col text-right pr-2 pl-0-md pr-0-md">
            <div class="media align-items-center">
              <div class="media-body">
                <div>
                  <div class="wrap-ellipsis small-xs no-small-md ml-auto" style="width: 150px;">
                    <price :value="item.trade.aachg" :currency-info="item.info.assetInfo" title="Asset" />
                  </div>
                </div>
                <div class="text-muted small mb-1">
                  @ <price :value="item.trade.price" :currency-info="item.info.currencyInfo" title="Price" />
                </div>
              </div>
              <div class="ml-2">
                <cryptoicon :symbol="item.info.asset"/>
              </div>
            </div>
          </div>
          <div class="col-1 text-center d-none d-md-block pt-2">
            <fa-icon v-if="item.trade.alert" icon="exclamation-triangle" :style="{ 'font-size': '1.5em' }" v-b-tooltip.top.html="alertText(item)"/>
            <fa-icon v-else-if="item.trade.buy" icon="arrow-left" :style="{ color: '#6a994e', 'font-size': '1.5em' }" v-b-tooltip.top="'Buy'"/>
            <fa-icon v-else icon="arrow-right" variant="danger" :style="{ color: '#bc4749', 'font-size': '1.5em' }" v-b-tooltip.top="'Sell'"/>
          </div>
          <div class="col text-center mb-1 d-md-none" style="flex: 0 0 auto;">
            <fa-icon v-if="item.trade.alert" icon="exclamation-triangle" :style="{ 'font-size': '1.5em' }" v-b-tooltip.top.html="alertText(item)"/>
            <fa-icon v-else-if="item.trade.buy" icon="arrow-up" :style="{ color: '#6a994e', 'font-size': '1.5em' }" v-b-tooltip.top="'Buy'"/>
            <fa-icon v-else icon="arrow-down" variant="danger" :style="{ color: '#bc4749', 'font-size': '1.5em' }" v-b-tooltip.top="'Sell'"/>
          </div>
          <div class="col pl-lg-0 pr-lg-0">
            <div class="media align-items-center" style="height: 100%;">
              <div class="mr-2">
                <cryptoicon :symbol="item.info.currency"/>
              </div>
              <div class="media-body">
                <div class="wrap-ellipsis small-xs no-small-md" style="width: 150px;">
                  <price :value="item.trade.volume" :currency-info="item.info.currencyInfo" title="Currency" />
                </div>
                <price v-if="globalSettings.pnlType === 0" :value="item.trade.normch" :currency-info="item.info.currencyInfo" title="Normalized profit" add-sign colored class="small mb-1" />
                <price v-else-if="globalSettings.pnlType === 1" :value="item.trade.rplDiff" :currency-info="item.info.currencyInfo" title="ACB" add-sign colored hide-zero class="small mb-1" />
                <price v-else-if="globalSettings.pnlType === 2" :value="item.trade.plDiff" :currency-info="item.info.currencyInfo" title="Equity change" add-sign colored class="small mb-1" />
              </div>
            </div>
          </div>
          <div class="col-auto text-right text-nowrap" style="min-width: 45px;">
            <span v-if="item.trade.man" v-b-tooltip.top title="Manual trade"><fa-icon icon="hand-paper"/></span>
          </div>
          <!-- <div class="col-12 col-sm-3 col-md-2 p-0 text-right text-nowrap" v-b-tooltip.bottom :title="item.trade.data">
            Debug
          </div> -->
        </b-list-group-item>
      </b-list-group>
    </b-container>
    <b-pagination
      limit="9"
      first-number
      last-number
      align="fill"
      aria-controls="orders"
      v-model="currentPage"
      :total-rows="filteredRows"
      :per-page="pageSize"
      class="mt-2">
    </b-pagination>
  </div>
</template>

<script>
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
import Cryptoicon from './Cryptoicon.vue'
import Price from './Price.vue'
import alerts from '@/data/alerts'

const { mapGetters: mapEventGetters } = createNamespacedHelpers('events')
const { mapGetters: mapSettingsGetters } = createNamespacedHelpers('settings')

export default {
  name: 'TradesTableModern',
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
      return prefiltered.filter(t => (buy && t.buy && !t.alert) || (sell && !t.buy && !t.alert) || (alert && t.alert))
    },
    dataView () {
      const result = [...this.filtered]
        .sort((a, b) => b.time - a.time)
        .slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        .map(trade => ({ trade, info: this.info(trade.symbol) }))
        .reduce((acc, value) => {
          const key = moment(value.trade.time).format('DD.MM.YYYY')
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(value)
          return acc
        }, {})

      return Object.entries(result)
        .map(([key, value]) => ({ key, trades: value }))
    },
    ...mapEventGetters(['trades', 'tradesFlat', 'info']),
    ...mapSettingsGetters(['globalSettings'])
  },
  methods: {
    formatTime (time) {
      return moment(time).format('HH:mm:ss')
    },
    tradeClass (trade) {
      if (trade.man) return ' bg-manual'
      if (trade.alert) return ' opacity-3'
      return ''
    },
    alertText (item) {
      if (!item.trade.alertObj) return 'Alert'
      return '<b>Alert:</b><br/>' + alerts.lookup(item.trade.alertObj.reason)[0]
    }
  },
  components: {
    Cryptoicon,
    Price
  }
}
</script>
