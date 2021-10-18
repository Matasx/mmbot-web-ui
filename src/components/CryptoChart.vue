<template>
  <highcharts :options="chartOptions"/>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'CryptoChart',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['trades', 'orders']),
    plotLines () {
      const info = this.info
      const filterSymbol = info.symbol
      return this.orders(filterSymbol)
        .map(order => ({
          zIndex: 2,
          className: order.dir < 0 ? 'plot-line-buy' : 'plot-line-sell',
          label: {
            formatter () {
              return this.options.value + ' ' + info.assetInfo.symbol
            },
            className: order.dir < 0 ? 'svg-text-danger' : 'svg-text-success'
          },
          value: order.price
        }))
    },
    tradeSeries () {
      const filterSymbol = this.info.symbol
      return [{
        name: this.info.title,
        marker: {
          enabled: true,
          radius: 3,
          symbol: 'diamond'
        },
        data: [...this.trades(filterSymbol)]
          .sort((a, b) => a.time - b.time)
          .map(trade => ({
            x: trade.time,
            y: trade.price,
            colorIndex: trade.alert ? 0 : (trade.buy ? 1 : 2)
          }))
      }]
    },
    chartOptions () {
      return {
        title: {
          text: this.info.title + ' - Trades price'
        },
        chart: {
          panning: {
            enabled: true,
            type: 'x'
          }
          // zoomType: 'x'
        },
        mapNavigation: {
          enabled: true
          // enableMouseWheelZoom: true
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: '<b>{point.y}</b><br/>',
          valueSuffix: ' ' + this.info.assetInfo.symbol
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Time'
          }
        },
        yAxis: {
          title: {
            text: 'Price'
          },
          labels: {
            format: '{value} ' + this.info.assetInfo.symbol
          },
          plotLines: this.plotLines
        },
        series: this.tradeSeries
      }
    }
  }
}
</script>
