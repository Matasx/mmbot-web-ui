/* eslint-disable promise/param-names */
import {
  AUTH_CHECK,
  AUTH_SET_DATA,
  AUTH_LOGOUT
} from '@/store/actions/auth'
import axios from 'axios'
import router from '@/router'

const state = {
  data: {
    admin: false,
    viewer: false,
    jwt: false,
    user: null
  }
}

const getters = {
  error: state => state.error,
  hasError: state => !!state.error,
  viewer: state => state.data.viewer,
  admin: state => state.data.admin,
  user: state => state.data.user
}

const actions = {
  async [AUTH_CHECK] ({ commit, getters }, allowNavigate) {
    const response = await axios.get('api/user')
    const needsRedirect = allowNavigate &&
      (!response.data ||
        getters.viewer !== response.data.viewer ||
        getters.admin !== response.data.admin)
    commit(AUTH_SET_DATA, response.data)
    if (needsRedirect) {
      router.push('/login')
    }
  },
  async [AUTH_LOGOUT] ({ dispatch }) {
    await axios.delete('api/user')
    await dispatch(AUTH_CHECK, true)
  }
}

const mutations = {
  [AUTH_SET_DATA]: (state, data) => {
    state.data = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
