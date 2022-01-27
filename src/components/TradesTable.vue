<template>
  <div v-if="settings.show">
    <b-form-group label="Filter" v-slot="{ ariaDescribedby }">
      <b-form-checkbox-group
        v-model="typeFilter"
        :options="options"
        :aria-describedby="ariaDescribedby"
        size="sm"
        buttons
        button-variant="primary"
      ></b-form-checkbox-group>
    </b-form-group>
    <trades-table-modern v-if="settings.modern" :trader-filter="traderFilter" :type-filter="typeFilter" :page-size="settings.pageSize"/>
    <trades-table-classic v-else :trader-filter="traderFilter" :type-filter="typeFilter" :page-size="settings.pageSize"/>
  </div>
</template>

<script>
import TradesTableModern from '@/components/TradesTableModern.vue'
import TradesTableClassic from '@/components/TradesTableClassic.vue'

export default {
  name: 'TradesTable',
  components: {
    TradesTableModern,
    TradesTableClassic
  },
  props: {
    settings: {
      type: Object,
      required: true
    },
    traderFilter: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {
      typeFilter: ['alert', 'buy', 'sell'],
      options: [
        { text: 'Alert', value: 'alert' },
        { text: 'Buy', value: 'buy' },
        { text: 'Sell', value: 'sell' }
      ]
    }
  }
}
</script>
