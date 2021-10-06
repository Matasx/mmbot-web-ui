<template>
  <div>
    <b-form class="login mb-3" @submit.prevent="login">
      <b-form-group label-for="input-1" label="Username:">
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-icon icon="person-fill" aria-hidden="true"></b-icon>
          </b-input-group-prepend>
          <b-form-input id="input-1" :state="!!username" v-model="username" autocomplete="username" placeholder="Enter your username" type="text" />
        </b-input-group>
      </b-form-group>
      <b-form-group label-for="input-2" label="Password:">
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-icon icon="key-fill" aria-hidden="true"></b-icon>
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
import { AUTH_REQUEST } from '../store/actions/auth'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('auth')

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
  methods: {
    login: async function () {
      const { username, password } = this
      try {
        await this.authLogin({ username, password })
      } catch (error) {
        this.error = error.toString()
        this.alertCountDown = this.dismissSecs
      }
    },
    countDownChanged (remaining) {
      this.alertCountDown = remaining
    },
    ...mapActions({
      authLogin: AUTH_REQUEST
    })
  }
}
</script>
