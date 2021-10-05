<template>
  <div>
    <h1>Trades</h1>
    <b-form-group
      v-slot="{ ariaDescribedby }">
      <b-form-checkbox-group
        v-model="selectedFilter"
        :options="filterOptions"
        :aria-describedby="ariaDescribedby"
        switches
        name="button-filter"
      ></b-form-checkbox-group>
    </b-form-group>
    <b-table
      id="orders"
      striped
      hover
      sort-by="data.time"
      sort-desc
      :per-page="perPage"
      :current-page="currentPage"
      :items="filtered"
      :fields="fields"
      primary-key="pk">
      <template #cell(icon)="data">
        <b-icon v-if="data.item.alert" icon="exclamation-circle-fill" variant="warning" font-scale="1.5"></b-icon>
        <b-icon v-else-if="data.item.data.achg > 0" icon="plus-circle" variant="success" font-scale="1.5"></b-icon>
        <b-icon v-else icon="dash-circle" variant="danger" font-scale="1.5"></b-icon>
      </template>
      <template #cell(broker_icon)="data">
        <b-img width="25" :src="'https://www.mmbot.trade/live/' + info(data.item.symbol).data.brokerIcon" alt="Ex."></b-img>
      </template>
      <template #cell(data_normch)="data">
        <b v-bind:class="[ data.item.data.normch < 0 ? 'text-danger' : 'text-success' ]">{{ data.item.data.normch }}</b>
      </template>
    </b-table>
    <b-pagination
      limit="9"
      first-number
      last-number
      align="fill"
      aria-controls="orders"
      v-model="currentPage"
      :total-rows="filteredRows"
      :per-page="perPage">
    </b-pagination>
  </div>
</template>

<script>
import moment from 'moment'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('events')

export default {
  data () {
    return {
      selectedFilter: [],
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: 'data.time',
          label: 'Time',
          sortable: true,
          formatter: value => {
            return moment(value).format('L HH:mm:ss')
          }
        },
        {
          key: 'broker_icon',
          label: ''
        },
        {
          key: 'symbol',
          label: 'Pair',
          sortable: true,
          sortByFormatted: true,
          formatter: value => {
            return this.info(value).data.title
          }
        },
        {
          key: 'icon',
          label: ''
        },
        {
          key: 'data.achg',
          label: 'Size',
          sortable: true
        },
        {
          key: 'data.price',
          label: 'Price',
          sortable: true
        },
        {
          key: 'data.gain',
          label: 'P/L',
          sortable: true
        },
        {
          key: 'data_normch',
          label: 'norm. P/L',
          sortable: true
        }
        // 'data'
      ]
    }
  },
  computed: {
    filterOptions () {
      return this.infos.map(info => ({ text: info.data.title, value: info.symbol }))
    },
    rows () {
      return this.trades.length
    },
    filteredRows () {
      return this.filtered.length
    },
    filtered () {
      var activeFilter = this.selectedFilter
      return this.trades
        .filter(trade => activeFilter.length === 0 || activeFilter.includes(trade.symbol))
    },
    ...mapGetters(['trades', 'infos', 'info'])
  }
}
</script>
