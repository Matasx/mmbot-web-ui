import {
  SETTINGS_THEME_SET,
  SETTINGS_DASHBOARD_DETAILS_SET,
  SETTINGS_DASHBOARD_SETTINGS_SET,
  LIGHT_SKIN
} from '@/store/actions/settings'

const state = {
  theme: LIGHT_SKIN,
  dashboardDetails: false,
  dashboardSettings: {
    traderFilter: true,
    transactionCount: false,
    avgPlPosition: true,
    avgPlNorm: true,
    trades: true,
    tradesModern: true,
    pageSize: 20
  }
}

const getters = {
  theme: state => state.theme,
  dashboardDetails: state => state.dashboardDetails,
  dashboardSettings: state => state.dashboardSettings
}

const actions = {
}

const mutations = {
  [SETTINGS_THEME_SET]: (state, theme) => {
    state.theme = theme
  },
  [SETTINGS_DASHBOARD_SETTINGS_SET]: (state, settings) => {
    state.dashboardSettings = settings
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
