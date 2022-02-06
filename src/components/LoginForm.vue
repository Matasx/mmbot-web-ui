<template>
  <div>
    <b-form class="login mb-3" @submit.prevent="login">
      <b-form-group label-for="input-1" label="Username:">
        <b-input-group>
          <b-input-group-prepend is-text>
            <fa-icon icon="user"/>
          </b-input-group-prepend>
          <b-form-input id="input-1" :state="!!username" v-model="username" autocomplete="username" placeholder="Enter your username" type="text" />
        </b-input-group>
      </b-form-group>
      <b-form-group label-for="input-2" label="Password:">
        <b-input-group>
          <b-input-group-prepend is-text>
            <fa-icon icon="key"/>
          </b-input-group-prepend>
          <b-form-input id="input-2" :state="!!password" v-model="password" autocomplete="current-password" placeholder="Enter your password" type="password" />
        </b-input-group>
      </b-form-group>
      <b-form-row>
        <b-col cols="3" offset="6"><b-button block size="lg" type="reset" variant="outline-danger">Reset</b-button></b-col>
        <b-col cols="3"><b-button block size="lg" type="submit" variant="success">Login</b-button></b-col>
      </b-form-row>
    </b-form>

    <b-alert :show="alertCountDown" dismissible variant="danger" @dismissed="alertCountDown=0" @dismiss-count-down="countDownChanged">
      <p>{{ error }}</p>
      <b-progress variant="danger" :max="dismissSecs" :value="alertCountDown" height="4px"></b-progress>
    </b-alert>
  </div>
</template>

<script>
import { AUTH_CHECK } from '@/store/actions/auth'
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'
import router from '@/router'
const { mapGetters, mapActions } = createNamespacedHelpers('auth')

export default {
  name: 'LoginForm',
  data () {
    return {
      username: '',
      password: '',
      error: '',
      dismissSecs: 5,
      alertCountDown: 0
    }
  },
  computed: {
    ...mapGetters(['user', 'viewer', 'admin']),
    redirect () {
      const redirect = this.$route.query.redirect
      return !!redirect && redirect.length > 0 ? redirect : '/'
    }
  },
  methods: {
    login: async function () {
      try {
        const response = await axios.post('api/user', {
          user: this.username,
          password: this.password,
          cookie: 'permanent' // temporary, return
        })

        if (!!response.data && (response.data.viewer || response.data.admin)) {
          await this.authCheck()
          this.doRedirect()
        } else {
          throw new Error('Login attempt failed!')
        }
      } catch (error) {
        this.error = error.toString()
        this.alertCountDown = this.dismissSecs
      }
    },
    countDownChanged (remaining) {
      this.alertCountDown = remaining
    },
    ...mapActions({
      authCheck: AUTH_CHECK
    }),
    doRedirect () {
      router.push(this.redirect)
    }
  },
  async mounted () {
    try {
      await this.authCheck()
      if (this.admin) {
        this.doRedirect()
      }
    } catch (error) {
      this.error = error.toString()
      this.alertCountDown = this.dismissSecs
    }
  }
}
</script>
