<template>
  <body>
    <header>
      <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-brand href="#" id="brand">MMBOT</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item-dropdown text="Trades">
              <b-dropdown-item to="/trades">Classic</b-dropdown-item>
              <b-dropdown-item to="/trades-modern">Modern</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item to="/test">Test</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <skin-toggle></skin-toggle>
            <b-nav-item-dropdown v-if="isAuthenticated" right>
              <template #button-content>
                {{ username }}
              </template>
              <b-dropdown-item @click="authLogout">
                <fa-icon icon="power-off" class="mb-1"/> Sign Out
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-popover target="brand" triggers="hover" placement="bottom" variant="secondary">
        <template #title>Server version</template>
        {{ backendVersion }}
      </b-popover>
    </header>
    <b-container>
      <router-view/>
    </b-container>
  </body>
</template>

<script>
import SkinToggle from './components/SkinToggle.vue'
import { AUTH_LOGOUT } from './store/actions/auth'
import { createNamespacedHelpers } from 'vuex'
const auth = createNamespacedHelpers('auth')
const events = createNamespacedHelpers('events')

export default {
  components: { SkinToggle },
  computed: {
    ...auth.mapGetters(['username', 'isAuthenticated']),
    ...events.mapGetters(['backendVersion'])
  },
  methods: {
    ...auth.mapActions({
      authLogout: AUTH_LOGOUT
    })
  }
}
</script>
