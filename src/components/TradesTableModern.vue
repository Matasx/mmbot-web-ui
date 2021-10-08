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
    <b-container>
      <b-list-group>
        <b-list-group-item class="row d-flex" v-for="item in sample" :key="item.trade.pk">
          <div class="col-4 col-md-2 p-0">
            <div class="media align-items-center" v-b-tooltip.top :title="item.info.brokerName">
              <b-img class="mr-3" width="32" :src="'https://www.mmbot.trade/live/' + item.info.brokerIcon" alt="Ex."></b-img>
              <div class="media-body small-xs no-small-md">
                <div class="text-muted small text-uppercase">{{ item.info.title }}</div>
                <div>
                  <span>
                    <span class="text-uppercase">{{ formatTime(item.trade.time) }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col text-right pr-2 pl-0-md pr-0-md">
            <div class="media align-items-center">
              <div class="media-body">
                <div class="text-muted small text-uppercase mb-1">Kraken</div>
                <div>
                  <div class="wrap-ellipsis small-xs no-small-md" style="width: 150px;">
                    <span>{{ item.trade.achg + ' ' + item.info.asset }}</span>
                  </div>
                </div>
              </div>
              <div class="ml-2">
                <cryptoicon :symbol="item.info.asset"/>
              </div>
            </div>
          </div>
          <div class="col-1 text-center d-none d-md-block pt-2">
              <fa-icon v-if="item.trade.alert" icon="exclamation-triangle" size="2x"/>
              <fa-icon v-else-if="item.trade.achg > 0" icon="arrow-left" :style="{ color: '#6a994e' }" size="2x"/>
              <fa-icon v-else icon="arrow-right" variant="danger" :style="{ color: '#bc4749' }" size="2x"/>
          </div>
          <div class="col pl-lg-0 pr-lg-0">
            <div class="media align-items-center">
              <div class="mr-2">
                <cryptoicon :symbol="item.info.currency"/>
              </div>
              <div class="media-body">
                <div>
                  <div class="wrap-ellipsis small-xs no-small-md" style="width: 150px;">
                    <span>{{ item.trade.price + ' ' + item.info.currency }}</span>
                  </div>
                </div>
                <div class="text-muted small text-uppercase mb-1">SUBTEXT</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-3 col-md-2 p-0 text-right text-nowrap">
            DD
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-container>
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
import Cryptoicon from './Cryptoicon.vue'
const { mapGetters } = createNamespacedHelpers('events')

export default {
  name: 'TradesTableModern',
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
    sample () {
      return [...this.filtered]
        .sort((a, b) => b.time - a.time)
        .slice(0, 10)
        .map(trade => ({ trade, info: this.info(trade.symbol) }))
    },
    ...mapGetters(['trades', 'infos', 'info'])
  },
  methods: {
    formatTime (time) {
      return moment(time).format('HH:mm:ss')
    }
  },
  components: {
    Cryptoicon
  }
}
</script>
    Cryptoicon
