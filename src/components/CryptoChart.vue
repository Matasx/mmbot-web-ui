<template>
  <highcharts v-if="loaded" :options="chartOptions"/>
  <b-skeleton-wrapper loading v-else>
    <template #loading>
      <b-card>
        <b-skeleton width="85%"></b-skeleton>
        <br />
        <b-skeleton-img no-aspect height="330px"></b-skeleton-img>
      </b-card>
    </template>
  </b-skeleton-wrapper>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import format from '@/utils/format'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'CryptoChart',
  props: {
    info: {
      type: Object,
      required: true
    },
    sourceName: {
      type: String,
      default: 'trades'
    },
    chartType: {
      type: String,
      default: 'line'
    },
    chartTitleSymbol: {
      type: Boolean,
      default: true
    },
    chartTitle: {
      type: String,
      required: true
    },
    yTitle: {
      type: String,
      required: true
    },
    yValue: {
      type: String,
      required: true
    },
    yUnit: {
      type: String,
      default: 'assetInfo'
    },
    yValueSecondary: String,
    yTitleSecondary: String,
    flipOrderTitles: {
      type: Boolean,
      require: false,
      default: false
    },
    loaded: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    orderTitleOffset (isBuy) {
      const buy = this.flipOrderTitles ? 13 : -4
      const sell = this.flipOrderTitles ? -4 : 13
      return isBuy ? buy : sell
    }
  },
  computed: {
    ...mapGetters(['trades', 'dailyAggregations', 'misc', 'ordersExt', 'firstTradeGlobal', 'lastTradeGlobal']),
    source () {
      return this[this.sourceName ?? 'trades'](this.info.symbol)
    },
    orderMin () {
      return Math.min(...this.orderValues)
    },
    orderMax () {
      return Math.max(...this.orderValues)
    },
    enabled () {
      return this.misc(this.info.symbol).en
    },
    timeMin () {
      if (!this.enabled) return null
      return (this.firstTradeGlobal ?? {}).time
    },
    timeMax () {
      if (!this.enabled) return null
      return (this.lastTradeGlobal ?? {}).time
    },
    orderValues () {
      return this.ordersExt(this.info.symbol).map(o => o[this.yValue])
    },
    plotLines () { // Active orders
      const info = this.info
      const yUnit = this.yUnit
      return this.ordersExt(info.symbol)
        .map(order => ({
          zIndex: 2,
          className: order.dir < 0 ? 'plot-line-buy' : 'plot-line-sell',
          label: {
            formatter () {
              return format.autoFormat(this.options.value) + ' ' + info[yUnit].symbol
            },
            className: order.dir < 0 ? 'svg-text-danger' : 'svg-text-success',
            y: this.orderTitleOffset(order.dir < 0)
          },
          value: order[this.yValue]
        }))
    },
    tradeSeries () { // Selected time series
      const series = [{
        name: this.yTitle,
        marker: {
          enabled: true,
          radius: 3,
          symbol: 'diamond'
        },
        data: this.source
          .map(trade => ({
            x: trade.time,
            y: trade[this.yValue],
            type: trade.agg ? 'Aggregation' : (trade.alert ? 'Alert' : (trade.buy ? 'Buy' : 'Sell')),
            colorIndex: trade.agg ? (trade[this.yValue] >= 0 ? 1 : 2) : (trade.alert ? 0 : (trade.buy ? 1 : 2))
          }))
      }]

      if (this.yValueSecondary) {
        series.push({ // Secondary charts
          name: this.yTitleSecondary,
          marker: {
            enabled: false
          },
          colorIndex: 3,
          data: this.source
            .map(trade => ({
              x: trade.time,
              y: trade[this.yValueSecondary]
            }))
        })
      }

      return series
    },
    chartOptions () {
      return {
        title: {
          text: (this.chartTitleSymbol ? (this.info.title + ' - ') : '') + this.chartTitle
        },
        chart: {
          type: this.chartType
        },
        // chart: {
        //   panning: {
        //     enabled: true,
        //     type: 'x'
        //   },
        //   zoomType: 'x'
        // },
        // mapNavigation: {
        //   enabled: true
        //   // enableMouseWheelZoom: true
        // },
        legend: {
          enabled: false
        },
        tooltip: {
          shared: true,
          crosshairs: true,
          useHTML: true,
          headerFormat: '<table><tr><th><b>{point.point.type}&nbsp;</b></th><th>{point.key}</th></tr>',
          pointFormat: '<tr><td>{series.name} </td><td style="text-align: right"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          valueSuffix: ' ' + this.info[this.yUnit].symbol,
          valueDecimals: 6
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Time'
          },
          softMin: this.timeMin,
          softMax: this.timeMax
        },
        yAxis: {
          title: {
            text: this.yTitle
          },
          labels: {
            format: '{value} ' + this.info[this.yUnit].symbol
          },
          plotLines: this.plotLines,
          softMin: this.orderMin,
          softMax: this.orderMax,
          startOnTick: false,
          endOnTick: false
        },
        series: this.tradeSeries
      }
    }
  }
}
</script>
