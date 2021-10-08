<template>
  <div>
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
      sort-by="time"
      sort-desc
      :per-page="perPage"
      :current-page="currentPage"
      :items="filtered"
      :fields="fields"
      primary-key="pk">
      <template #cell(icon)="data">
        <fa-icon v-if="data.item.alert" icon="exclamation-triangle"/>
        <fa-icon v-else-if="data.item.achg > 0" icon="arrow-right" :style="{ color: '#6a994e' }"/>
        <fa-icon v-else icon="arrow-left" variant="danger" :style="{ color: '#bc4749' }"/>
      </template>
      <template #cell(broker_icon)="data">
        <b-img width="25" :src="'https://www.mmbot.trade/live/' + info(data.item.symbol).brokerIcon" alt="Ex."></b-img>
      </template>
      <template #cell(normch)="data">
        <b v-bind:class="[ data.item.normch < 0 ? 'text-danger' : 'text-success' ]">{{ data.item.normch }}</b>
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
  name: 'TradesTableClassic',
  data () {
    return {
      selectedFilter: [],
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: 'time',
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
            return this.info(value).title
          }
        },
        {
          key: 'icon',
          label: ''
        },
        {
          key: 'achg',
          label: 'Size',
          sortable: true
        },
        {
          key: 'price',
          label: 'Price',
          sortable: true
        },
        {
          key: 'gain',
          label: 'P/L',
          sortable: true
        },
        {
          key: 'normch',
          label: 'norm. P/L',
          sortable: true
        }
      ]
    }
  },
  computed: {
    filterOptions () {
      return this.infos.map(info => ({ text: info.title, value: info.symbol }))
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
