<template>
  <div>
    <b-progress :max="totalSize">
      <b-progress-bar v-if="buyOrder" :value="buySize" variant="success" class="text-white">
        <price :value="buyOrder.price - priceCurrent.price" :currency-info="info.currencyInfo" add-sign/>
      </b-progress-bar>
      <b-progress-bar :value="priceSizeWithSlider" variant="info" class="text-white font-weight-bold">
        <price :value="priceCurrent.price" :currency-info="info.currencyInfo"/>
      </b-progress-bar>
      <b-progress-bar v-if="sellOrder" :value="sellSize" variant="danger" class="text-white">
        <price :value="sellOrder.price - priceCurrent.price" :currency-info="info.currencyInfo" add-sign/>
      </b-progress-bar>
    </b-progress>
    <b-progress class="mt-1" :max="totalSize">
      <b-progress-bar v-if="buyOrder" :value="buySize" variant="success" class="text-white">
        <price :value="buyOrder.size" :currency-info="info.assetInfo" add-sign/>
      </b-progress-bar>
      <b-progress-bar :value="priceLeftSize" variant="primary"></b-progress-bar>
      <b-progress-bar :value="sliderSize" variant="info"></b-progress-bar>
      <b-progress-bar :value="priceRightSize" variant="primary"></b-progress-bar>
      <b-progress-bar v-if="sellOrder" :value="sellSize" variant="danger" class="text-white">
        <price :value="sellOrder.size" :currency-info="info.assetInfo" add-sign/>
      </b-progress-bar>
    </b-progress>
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
  computed: {
    ...mapGetters(['misc', 'ordersMap', 'price']),
    localMisc () {
      return this.misc(this.info.symbol)
    },
    buyOrder () {
      // todo: accept any -2 -3 etc.
      return this.ordersMap(this.info.symbol)[1]
    },
    buySize () {
      return this.buyOrder ? this.orderSize : 0
    },
    sellOrder () {
      return this.ordersMap(this.info.symbol)[-1]
    },
    sellSize () {
      return this.sellOrder ? this.orderSize : 0
    },
    priceCurrent () {
      return this.price(this.info.symbol)
    },
    priceSizeWithSlider () {
      return this.totalSize - this.buySize - this.sellSize
    },
    priceSize () {
      return this.priceSizeWithSlider - this.sliderSize
    },
    priceLeftSize () {
      return this.priceSize - this.priceRightSize
    },
    priceRightSize () {
      if (!this.priceCurrent || (!this.buySize && !this.sellSize)) {
        return this.priceSize * 0.5
      }
      if (!this.buySize) {
        return this.priceSize
      }
      if (!this.sellSize) {
        return 0
      }
      const diff = this.sellOrder.price - this.buyOrder.price
      const pos = this.sellOrder.price - this.priceCurrent.price

      return (pos * this.priceSize) / diff
    }
  }
}
</script>
