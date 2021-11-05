<template>
  <highcharts :options="chartOptions"/>
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
    yTitleSecondary: String
  },
  computed: {
    ...mapGetters(['trades', 'ordersExt']),
    softMax () {
      return Math.max(...this.orderValues)
    },
    softMin () {
      return Math.min(...this.orderValues)
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
            y: order.dir < 0 ? -4 : 13
          },
          value: order[this.yValue]
        }))
    },
    tradeSeries () { // Selected time series
      const filterSymbol = this.info.symbol
      const series = [{
        name: this.yTitle,
        marker: {
          enabled: true,
          radius: 3,
          symbol: 'diamond'
        },
        data: this.trades(filterSymbol)
          .map(trade => ({
            x: trade.time,
            y: trade[this.yValue],
            type: trade.alert ? 'Alert' : (trade.buy ? 'Buy' : 'Sell'),
            colorIndex: trade.alert ? 0 : (trade.buy ? 1 : 2)
          }))
      }]

      if (this.yValueSecondary) {
        series.push({ // Secondary charts
          name: this.yTitleSecondary,
          marker: {
            enabled: false
          },
          colorIndex: 3,
          data: this.trades(filterSymbol)
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
          }
        },
        yAxis: {
          title: {
            text: this.yTitle
          },
          labels: {
            format: '{value} ' + this.info[this.yUnit].symbol
          },
          plotLines: this.plotLines,
          softMin: this.softMin,
          softMax: this.softMax
        },
        series: this.tradeSeries
      }
    }
  }
}
</script>
