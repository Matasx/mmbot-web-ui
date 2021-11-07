<template>
  <div>
    <trades-table-modern v-if="settings.show && settings.modern" :trader-filter="traderFilter" :page-size="settings.pageSize"/>
    <trades-table-classic v-if="settings.show && !settings.modern" :trader-filter="traderFilter" :page-size="settings.pageSize"/>
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
  }
}
</script>
