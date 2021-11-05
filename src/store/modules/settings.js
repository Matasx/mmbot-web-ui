import {
  SETTINGS_DATA_SET,
  SETTINGS_THEME_SET,
  SETTINGS_DASHBOARD_DETAILS_SET,
  SETTINGS_DASHBOARD_SETTINGS_SET,
  SETTINGS_GLOBAL_SETTINGS_SET,
  LIGHT_SKIN
} from '@/store/actions/settings'

const state = {
  data: {
    theme: LIGHT_SKIN,
    dashboardDetails: false,
    dashboardSettings: { // todo: card options as subclass
      traderFilter: true,
      transactionCount: false,
      avgPlPosition: true,
      avgPlNorm: true,
      trades: true,
      tradesModern: true,
      pageSize: 20
    },
    globalSettings: {
      formatOmicron: true,
      formatMillion: true,
      formatAutoElipsis: false
    }
  }
}

const getters = {
  data: state => state.data,
  theme: state => state.data.theme,
  dashboardDetails: state => state.data.dashboardDetails,
  dashboardSettings: state => state.data.dashboardSettings,
  globalSettings: state => state.data.globalSettings
}

const actions = {
}

const mutations = {
  [SETTINGS_DATA_SET]: (state, data) => {
    state.data = data
  },
  [SETTINGS_THEME_SET]: (state, theme) => {
    state.data.theme = theme
  },
  [SETTINGS_DASHBOARD_SETTINGS_SET]: (state, settings) => {
    state.data.dashboardSettings = settings
  },
  [SETTINGS_DASHBOARD_DETAILS_SET]: (state, showDetails) => {
    state.data.dashboardDetails = showDetails
  },
  [SETTINGS_GLOBAL_SETTINGS_SET]: (state, settings) => {
    state.data.globalSettings = settings
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
