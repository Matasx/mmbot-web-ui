import {
  RUNTIME_SIDEBAR_SET
} from '@/store/actions/runtime'

const state = {
  sidebar: false
}

const getters = {
  sidebar: state => state.sidebar
}

const mutations = {
  [RUNTIME_SIDEBAR_SET]: (state, sidebar) => {
    state.sidebar = sidebar
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
