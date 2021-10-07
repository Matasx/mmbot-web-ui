import {
  SETTINGS_THEME_SET,
  LIGHT_SKIN
} from '@/store/actions/settings'

const state = {
  theme: LIGHT_SKIN
}

const getters = {
  theme: state => state.theme
}

const actions = {
}

const mutations = {
  [SETTINGS_THEME_SET]: (state, theme) => {
    state.theme = theme
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
