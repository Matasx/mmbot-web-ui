<template>
  <div>
    <b-form-row>
      <b-col cols="auto" v-if="localError.buyError" class="text-danger" v-b-tooltip.top :title="localError.buyError">
        <fa-icon icon="burn"/>
      </b-col>
      <b-col>
        <b-progress :max="totalSize">
          <b-progress-bar v-if="buyDetails.uiSize" :value="buyDetails.uiSize" :variant="buyVariant" class="text-white" :animated="buyDetails.activeTrade">
            <price v-if="buyDetails.showValue" :value="buyDetails.priceDiff" :currency-info="info.currencyInfo" add-sign/>
          </b-progress-bar>
          <b-progress-bar v-if="priceCurrent" :value="priceSizeWithSlider" variant="info" class="text-white font-weight-bold">
            <price :value="priceCurrent.price" :currency-info="info.currencyInfo"/>
          </b-progress-bar>
          <b-progress-bar v-if="sellDetails.uiSize" :value="sellDetails.uiSize" :variant="sellVariant" class="text-white" :animated="sellDetails.activeTrade">
            <price v-if="sellDetails.showValue" :value="sellDetails.priceDiff" :currency-info="info.currencyInfo" add-sign/>
          </b-progress-bar>
        </b-progress>
        <b-progress class="mt-1" :max="totalSize">
          <b-progress-bar v-if="buyDetails.uiSize" :value="buyDetails.uiSize" :variant="buyVariant" class="text-white" :animated="buyDetails.activeTrade">
            <price v-if="buyDetails.showValue" :value="buyDetails.order.size" :currency-info="info.assetInfo" add-sign/>
          </b-progress-bar>
          <b-progress-bar :value="priceLeftSize" variant="primary"></b-progress-bar>
          <b-progress-bar :value="sliderSize" variant="info"></b-progress-bar>
          <b-progress-bar :value="priceRightSize" variant="primary"></b-progress-bar>
          <b-progress-bar v-if="sellDetails.uiSize" :value="sellDetails.uiSize" :variant="sellVariant" class="text-white" :animated="sellDetails.activeTrade">
            <price v-if="sellDetails.showValue" :value="sellDetails.order.size" :currency-info="info.assetInfo" add-sign/>
          </b-progress-bar>
        </b-progress>
      </b-col>
      <b-col cols="auto" v-if="localError.sellError" class="text-danger"  v-b-tooltip.top :title="localError.sellError">
        <fa-icon icon="burn"/>
      </b-col>
    </b-form-row>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Price from './Price.vue'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'OrderSlider',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  components: {
    Price
  },
  data () {
    return {
      totalSize: 100,
      orderSize: 30,
      sliderSize: 2
    }
  },
  methods: {
    details (dir) {
      const m = this.localMisc
      const o = this.ordersMap(this.info.symbol)[dir]
      const p = this.priceCurrent
      const a = m && !!m.t && ((dir > 0 && m.t > 0) || (dir < 0 && m.t < 0))
      const v = o && o.price && p
      return {
        order: o,
        uiSize: v || a ? this.orderSize : 0,
        showValue: v,
        priceDiff: v ? o.price - p.price : 0,
        activeTrade: a
      }
    }
  },
  computed: {
    ...mapGetters(['misc', 'ordersMap', 'price', 'error']),
    localError () {
      return this.error(this.info.symbol) ?? {}
    },
    localMisc () {
      return this.misc(this.info.symbol)
    },
    buyVariant () {
      return this.localError.buyError ? 'dark' : 'success'
    },
    sellVariant () {
      return this.localError.sellError ? 'dark' : 'danger'
    },
    buyDetails () {
      return this.details(1) ?? this.details(2)
    },
    sellDetails () {
      return this.details(-1) ?? this.details(-2)
    },
    priceCurrent () {
      return this.price(this.info.symbol)
    },
    priceSizeWithSlider () {
      return this.totalSize - this.buyDetails.uiSize - this.sellDetails.uiSize
    },
    priceSize () {
      return this.priceSizeWithSlider - this.sliderSize
    },
    priceLeftSize () {
      return this.priceSize - this.priceRightSize
    },
    priceRightSize () {
      const b = this.buyDetails
      const s = this.sellDetails
      if (!this.priceCurrent || (!b.showValue && !s.showValue)) {
        return this.priceSize * 0.5
      }
      if (!b.showValue) {
        return this.priceSize
      }
      if (!s.showValue) {
        return 0
      }
      const diff = s.order.price - b.order.price
      const pos = s.order.price - this.priceCurrent.price

      return (pos * this.priceSize) / diff
    }
  }
}
</script>
