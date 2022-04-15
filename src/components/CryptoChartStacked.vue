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

const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'CryptoChartStacked',
  props: {
    infos: {
      type: Array,
      required: true
    },
    chartType: {
      type: String,
      default: 'area'
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
    loaded: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters(['hourlyTrades', 'firstTradeGlobal', 'lastTradeGlobal']),
    timeMin () {
      return (this.firstTradeGlobal ?? {}).time
    },
    timeMax () {
      return (this.lastTradeGlobal ?? {}).time
    },
    tradeSeries () { // Selected time series
      return this.infos.map(x => ({
        name: x.title,
        data: this.hourlyTrades(x.symbol)
          .map(trade => ({
            x: trade.time,
            y: trade[this.yValue]
          }))
      }))
    },
    unit () {
      return this.infos[0].currencyInfo.symbol
    },
    chartOptions () {
      return {
        title: {
          text: this.chartTitle
        },
        chart: {
          type: this.chartType
        },
        plotOptions: {
          area: {
            stacking: 'normal'
          }
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
          footerFormat: '</table>{this.total}',
          valueSuffix: ' ' + this.unit,
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
            format: '{value} ' + this.unit
          },
          startOnTick: false,
          endOnTick: false
        },
        series: this.tradeSeries
      }
    }
  }
}
</script>
