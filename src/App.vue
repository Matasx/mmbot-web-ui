<template>
  <body>
    <header>
      <b-navbar type="dark" variant="dark">
        <b-navbar-brand href="#">MMBOT</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Home</b-nav-item>
            <b-nav-item to="/trades">Trades</b-nav-item>
            <b-nav-item to="/test">Test</b-nav-item>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown v-if="isAuthenticated" right>
              <template #button-content>
                {{ username }}
              </template>
              <b-dropdown-item @click="authLogout">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <b-container>
      <router-view/>
    </b-container>
  </body>
</template>

<script>
import { AUTH_LOGOUT } from './store/actions/auth'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('auth')

export default {
  computed: {
    ...mapGetters(['username', 'isAuthenticated'])
  },
  methods: {
    ...mapActions({
      authLogout: AUTH_LOGOUT
    })
  }
}
</script>
