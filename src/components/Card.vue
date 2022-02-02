<template>
  <b-card v-if="loaded" no-body :border-variant="info.emulated ? 'info' : (localStats.avghpl >= 0 ? 'success' : 'danger')">
    <b-card-header>
      <div class="clearfix">
        <span class="float-left h5">
          <broker-name :info="info" :navigation="showLink"/>
          <rating :rating="localStats.rating" class="ml-1"/>
        </span>
        <span class="float-right text-info mt-1">
          <span v-if="localMisc.pos !== undefined">
            <fa-icon :icon="info.emulated ? 'vial' : 'map-pin'" class="mr-1 mb-1"/>
            <price :value="localMisc.pos" :currency-info="info.assetInfo" :title="info.emulated ? 'Virtual position (trainer)' : 'Position'"/>
            <b-spinner v-if="achieve" small type="grow" class="ml-1 mb-1"/>
          </span>
        </span>
      </div>
      <order-slider :info="info"/>
    </b-card-header>
    <b-card-body v-if="showDetails">
      <b-card-text>
        <div v-if="dashboardSettings.openPrice" class="clearfix">
          <span class="float-left">Enter price:</span>
          <span class="float-right">
            <b-badge variant="info" pill class="mr-1 text-white"><price :value="localMisc.op" :currency-info="info.currencyInfo" title="Cost basis" /></b-badge>
            <b-badge :variant="openPriceDiff < 0 ? 'success' : 'danger'" pill class="text-white"><price :value="openPriceDiff" :currency-info="percentageInfo" compress-title add-sign :allow-micro="false" title="Difference to current price" /></b-badge>
          </span>
        </div>
        <div v-if="dashboardSettings.rpnl" class="clearfix">
          <span class="float-left">Realized P/L:</span>
          <span class="float-right">
            <b-badge :variant="localMisc.rpnl >= 0 ? 'success' : 'danger'" pill class="mr-1 text-white"><price :value="localMisc.rpnl" :currency-info="info.currencyInfo" add-sign title="Total" /></b-badge>
            <b-badge :variant="localStats.rpnl_pp >= 0 ? 'success' : 'danger'" pill class="text-white"><price :value="localStats.rpnl_pp" :currency-info="percentageInfo" compress-title add-sign :allow-micro="false" title="Total portion of budget" /></b-badge>
          </span>
        </div>
        <div v-if="dashboardSettings.upnl" class="clearfix">
          <span class="float-left">Unrealized P/L:</span>
          <span class="float-right">
            <b-badge :variant="localMisc.upnl >= 0 ? 'success' : 'danger'" pill class="mr-1 text-white"><price :value="localMisc.upnl" :currency-info="info.currencyInfo" add-sign title="Total" /></b-badge>
            <b-badge :variant="localStats.upnl_pp >= 0 ? 'success' : 'danger'" pill class="text-white"><price :value="localStats.upnl_pp" :currency-info="percentageInfo" compress-title add-sign :allow-micro="false" title="Total portion of budget" /></b-badge>
          </span>
        </div>
        <div v-if="dashboardSettings.avgPlPosition" class="clearfix">
          <span class="float-left">Avg. P/L position:</span>
          <span class="float-right">
            <b-badge :variant="localStats.avghpl >= 0 ? 'success' : 'danger'" pill class="mr-1 text-white"><price :value="localStats.avghpl" :currency-info="info.currencyInfo" add-sign title="Per year" />/y</b-badge>
            <b-badge :variant="localStats.avghpl_pp >= 0 ? 'success' : 'danger'" pill class="text-white"><price :value="localStats.avghpl_pp" :currency-info="percentageInfo" compress-title add-sign :allow-micro="false" title="Per year" /></b-badge>
          </span>
        </div>
        <div v-if="dashboardSettings.avgPlNorm" class="clearfix">
          <span class="float-left">Avg. income norm:</span>
          <span class="float-right">
            <b-badge :variant="localStats.avgh >= 0 ? 'success' : 'danger'" pill class="mr-1 text-white"><price :value="localStats.avgh" :currency-info="info.currencyInfo" add-sign title="Per year" />/y</b-badge>
            <b-badge :variant="localStats.avgh_pp >= 0 ? 'success' : 'danger'" pill class="text-white"><price :value="localStats.avgh_pp" :currency-info="percentageInfo" compress-title add-sign :allow-micro="false" title="Per year" /></b-badge>
          </span>
        </div>
      </b-card-text>
    </b-card-body>
    <b-card-footer v-if="localError.error" footer-text-variant="danger">
      <fa-icon icon="burn" class="mr-2 mb-1"/>
      <em>{{ localError.error }}</em>
    </b-card-footer>
  </b-card>
  <b-skeleton-wrapper loading v-else>
    <template #loading>
      <b-card>
        <b-skeleton width="85%"></b-skeleton>
        <b-skeleton-img no-aspect height="40px"></b-skeleton-img>
      </b-card>
    </template>
  </b-skeleton-wrapper>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Price from './Price.vue'
import OrderSlider from './OrderSlider.vue'
import BrokerName from './BrokerName.vue'
import Rating from './Rating.vue'

const settings = createNamespacedHelpers('settings')
const events = createNamespacedHelpers('events')

export default {
  name: 'Card',
  props: {
    info: {
      type: Object,
      required: true
    },
    showDetails: {
      type: Boolean,
      default: false
    },
    showLink: {
      type: Boolean,
      default: false
    },
    loaded: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Price,
    OrderSlider,
    BrokerName,
    Rating
  },
  computed: {
    ...events.mapGetters(['misc', 'price', 'error', 'stats']),
    ...settings.mapGetters(['dashboardSettings']),
    percentageInfo () {
      return {
        symbol: '%',
        name: '%'
      }
    },
    localError () {
      return this.error(this.info.symbol) ?? {}
    },
    localMisc () {
      return this.misc(this.info.symbol) ?? {}
    },
    priceCurrent () {
      return this.price(this.info.symbol)
    },
    openPriceDiff () {
      if (this.priceCurrent.price === 0) return 0
      return (this.localMisc.op - this.priceCurrent.price) / this.priceCurrent.price * 100
    },
    localStats () {
      return this.stats(this.info.symbol)
    },
    achieve () {
      return this.localMisc.a
    }
  }
}
</script>
