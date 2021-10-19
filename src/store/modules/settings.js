import {
  SETTINGS_THEME_SET,
  SETTINGS_DASHBOARD_DETAILS_SET,
  LIGHT_SKIN
} from '@/store/actions/settings'

const state = {
  theme: LIGHT_SKIN,
  dashboardDetails: false
}

const getters = {
  theme: state => state.theme,
  dashboardDetails: state => state.dashboardDetails
}

const actions = {
}

const mutations = {
  [SETTINGS_THEME_SET]: (state, theme) => {
    state.theme = theme
  },
  [SETTINGS_DASHBOARD_DETAILS_SET]: (state, showDetails) => {
    state.dashboardDetails = showDetails
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
