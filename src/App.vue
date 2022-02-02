<template>
  <body>
    <header>
      <b-navbar :toggleable="false" type="dark" variant="navbar" fixed="top">
        <b-navbar-nav>
          <b-nav-item @click="toggleSidebar">
            <fa-icon icon="bars" size="lg"/>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-brand to="/" id="brand">MMBot <fa-icon icon="comment-dollar" class="mb-2" /></b-navbar-brand>

        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/settings" v-b-tooltip.bottom title="Global settings"><fa-icon icon="sliders-h"/></b-nav-item>
          <connectivity-indicator/>
          <b-nav-item v-b-modal.modal-log v-b-tooltip.bottom title="Log"><fa-icon icon="bug"/></b-nav-item>
          <skin-toggle/>
          <!-- <skin-picker/> -->
          <b-nav-item-dropdown v-if="isAuthenticated" right>
            <template #button-content>
              {{ username }}
            </template>
            <b-dropdown-item @click="authLogout">
              <fa-icon icon="power-off" class="mb-1"/> Sign Out
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>

      <b-modal id="modal-log" title="Logs" scrollable ok-only size="xl">
        <span v-for="log in logs.slice().reverse()" :key="log" class="log-entry">
          {{ log }}<br/>
        </span>
        <i v-if="!logs.length">No log entries.</i>
      </b-modal>

      <b-popover target="brand" triggers="hover" placement="bottom" variant="secondary">
        <template #title>Version</template>
        <b>Client:</b> {{ frontendVersion }}<br />
        <b>Server:</b> {{ backendVersion }}
      </b-popover>
    </header>
    <div id="wrapper" :class="{ toggled: showSidebar }">
      <div id="sidebar-wrapper">
        <b-nav vertical class="sidebar-links">
          <b-nav-item to="/">Dashboard</b-nav-item>
          <b-nav-item to="/performance">Daily performance</b-nav-item>
          <b-nav-item to="/wallets">Wallets</b-nav-item>
          <b-nav-item to="/test">Admin</b-nav-item>
        </b-nav>
        <nav-collapse title="Charts" id="charts">
          <b-nav-item to="/chart/price">Price</b-nav-item>
          <b-nav-item to="/chart/neutraldist">Distance to neutral price</b-nav-item>
          <b-nav-item to="/chart/profit">P&amp;L</b-nav-item>
          <b-nav-item to="/chart/dailyProfit">Daily P&amp;L</b-nav-item>
          <b-nav-item to="/chart/position">Position</b-nav-item>
          <b-nav-item to="/chart/norm">Normalized profit</b-nav-item>
          <b-nav-item to="/chart/trades">Trades</b-nav-item>
        </nav-collapse>
        <nav-collapse v-if="Array.isArray(infos) && infos.length" title="Traders" id="traders">
          <b-nav-item v-for="info in infos" :key="info.symbol" :to="'/trader/' + info.symbol">{{ info.title }}</b-nav-item>
        </nav-collapse>
        <nav-collapse title="Transactions" id="transactions">
          <b-nav-item to="/trades">Classic</b-nav-item>
          <b-nav-item to="/trades-modern">Modern</b-nav-item>
        </nav-collapse>
      </div>
      <div id="page-content-wrapper">
        <router-view/>
      </div>
    </div>
  </body>
</template>

<script>
import SkinToggle from '@/components/SkinToggle'
// import SkinPicker from './components/SkinPicker'
import ConnectivityIndicator from '@/components/ConnectivityIndicator'
import NavCollapse from '@/components/NavCollapse'
import { AUTH_LOGOUT } from '@/store/actions/auth'
import { RUNTIME_SIDEBAR_SET } from '@/store/actions/runtime'
import { createNamespacedHelpers } from 'vuex'
import ClientVersion from '@/version'
import Highcharts from 'highcharts'

const auth = createNamespacedHelpers('auth')
const events = createNamespacedHelpers('events')
const runtime = createNamespacedHelpers('runtime')

export default {
  components: { SkinToggle, ConnectivityIndicator, NavCollapse }, // SkinPicker
  data () {
    const mobileThreshold = 1100
    return {
      mobileThreshold,
      localSidebar: window.innerWidth >= mobileThreshold
    }
  },
  computed: {
    ...auth.mapGetters(['username', 'isAuthenticated']),
    ...events.mapGetters(['backendVersion', 'infos', 'logs']),
    ...runtime.mapGetters(['sidebar']),
    frontendVersion () {
      return ClientVersion
    },
    showSidebar () {
      return this.localSidebar && this.sidebar
    }
  },
  methods: {
    ...auth.mapActions({
      authLogout: AUTH_LOGOUT
    }),
    ...runtime.mapMutations({
      setSidebar: RUNTIME_SIDEBAR_SET
    }),
    setLocalSidebar (toggle) {
      if (this.showSidebar !== toggle) {
        this.localSidebar = toggle
        this.setSidebar(toggle)
        if (!this.isMobile()) {
          setTimeout(this.reflowCharts, 600)
        }
      }
    },
    toggleSidebar () {
      this.setLocalSidebar(!this.sidebar)
    },
    reflowCharts () {
      Highcharts.charts
        .filter(x => x)
        .forEach(x => x.reflow())
    },
    isMobile () {
      return window.innerWidth < this.mobileThreshold
    }
  }
}
</script>
