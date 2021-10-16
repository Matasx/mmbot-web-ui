import Vue from 'vue'
import HighchartsVue from 'highcharts-vue'
import HighchartsMapModule from 'highcharts/modules/map'
import Highcharts from 'highcharts'

HighchartsMapModule(Highcharts)

Highcharts.setOptions({
  chart: {
    styledMode: true
  },
  tooltip: {
    dateTimeLabelFormats: {
      millisecond: '%m/%d/%Y %H:%M:%S'
    }
  },
  xAxis: {
    dateTimeLabelFormats: {
      day: '%m/%d'
    }
  },
  yAxis: {
    tickAmount: 8
  }
})

Vue.use(HighchartsVue)
