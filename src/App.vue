<template>
  <body>
    <header style="margin-bottom: 4rem !important;">
      <b-navbar :toggleable="false" type="dark" variant="primary" fixed="top">
        <b-navbar-brand to="/" id="brand">MMBot <fa-icon icon="comment-dollar" class="mb-2" /></b-navbar-brand>
        <b-button size="sm" v-b-toggle.menu-sidebar class="ml-2" variant="primary">
          <span class="navbar-toggler-icon"></span>
        </b-button>

        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/settings" v-b-tooltip.bottom title="Global settings"><fa-icon icon="sliders-h"/></b-nav-item>
          <connectivity-indicator/>
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

      <b-sidebar id="menu-sidebar" title="Menu" bg-variant="primary" text-variant="light" backdrop shadow="lg">
        <div class="px-3 py-2">
          <b-nav vertical class="navbar-dark">
            <b-navbar-nav>
              <b-nav-item to="/">Dashboard</b-nav-item>
              <nav-collapse title="Charts" id="charts">
                <b-nav-item to="/chart/price">Price</b-nav-item>
                <b-nav-item to="/chart/neutraldist">Distance to neutral price</b-nav-item>
                <b-nav-item to="/chart/profit">P&amp;L</b-nav-item>
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
              <b-nav-item to="/">Wallets</b-nav-item>
              <b-nav-item to="/test">Test</b-nav-item>
            </b-navbar-nav>
          </b-nav>
        </div>
      </b-sidebar>

      <b-popover target="brand" triggers="hover" placement="bottom" variant="secondary">
        <template #title>Version</template>
        <b>Client:</b> {{ frontendVersion }}<br />
        <b>Server:</b> {{ backendVersion }}
      </b-popover>
    </header>
    <router-view/>
  </body>
</template>

<script>
import SkinToggle from '@/components/SkinToggle'
// import SkinPicker from './components/SkinPicker'
import ConnectivityIndicator from '@/components/ConnectivityIndicator'
import NavCollapse from '@/components/NavCollapse'
import { AUTH_LOGOUT } from '@/store/actions/auth'
import { createNamespacedHelpers } from 'vuex'
import ClientVersion from '@/version'
const auth = createNamespacedHelpers('auth')
const events = createNamespacedHelpers('events')

export default {
  components: { SkinToggle, ConnectivityIndicator, NavCollapse }, // SkinPicker
  computed: {
    ...auth.mapGetters(['username', 'isAuthenticated']),
    ...events.mapGetters(['backendVersion', 'infos']),
    frontendVersion () {
      return ClientVersion
    }
  },
  methods: {
    ...auth.mapActions({
      authLogout: AUTH_LOGOUT
    })
  }
}
</script>
