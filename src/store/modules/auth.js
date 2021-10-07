/* eslint-disable promise/param-names */
import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT
} from '@/store/actions/auth'
import axios from 'axios'
import router from '@/router'

const state = {
  credentials: null,
  status: '',
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: state => !!state.credentials,
  authStatus: state => state.status,
  username: (state, getters) => getters.isAuthenticated ? state.credentials.username : ''
}

const actions = {
  async [AUTH_REQUEST] ({ commit }, user) {
    commit(AUTH_REQUEST)
    // todo: move to lib to handle base url

    // var token = 'Basic ' + Buffer.from(user.username + ':' + user.password).toString('base64')
    // axios.defaults.headers.common.Authorization = token

    try {
      await axios.get('https://mmbot.matatko.cz/report.json', {
        auth: user
      })
      commit(AUTH_SUCCESS, user)
      router.push('/')
    } catch (error) {
      commit(AUTH_ERROR, error)
      throw error
    }
  },
  async [AUTH_LOGOUT] ({ commit }) {
    commit(AUTH_LOGOUT)
    router.push('/login')
  }
  // ,
  // async [AUTH_INITIALIZE] ({ dispatch }) {
  //   var credentials = getStoredCredentials()
  //   if (credentials) {
  //     await dispatch(AUTH_REQUEST, credentials)
  //   } else {
  //     await dispatch(AUTH_LOGOUT)
  //   }
  // }
}

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading'
    state.credentials = null
  },
  [AUTH_SUCCESS]: (state, credentials) => {
    state.status = 'success'
    state.credentials = credentials
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: state => {
    state.status = 'error'
    state.credentials = null
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: state => {
    state.status = ''
    state.credentials = null
    state.hasLoadedOnce = true
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
