import {
  SETTINGS_DATA_SET,
  SETTINGS_THEME_SET,
  SETTINGS_DASHBOARD_DETAILS_SET,
  SETTINGS_DASHBOARD_SETTINGS_SET,
  SETTINGS_GLOBAL_SETTINGS_SET,
  SETTINGS_TRADER_SETTINGS_SET,
  SETTINGS_MENU_TOGGLE_SET,
  LIGHT_SKIN
} from '@/store/actions/settings'

const state = {
  data: {
    theme: LIGHT_SKIN,
    dashboardDetails: false,
    dashboardSettings: { // todo: card options as subclass
      traderFilter: true,
      transactionCount: false,
      rpnl: true,
      upnl: true,
      avgPlPosition: true,
      avgPlNorm: true,
      tradesSettings: {
        show: true,
        modern: true,
        pageSize: 20
      }
    },
    traderSettings: {
      chartSettings: {
        showAll: true,
        filter: []
      },
      tradesSettings: {
        show: true,
        modern: true,
        pageSize: 20
      }
    },
    globalSettings: {
      formatOmicron: true,
      formatMillion: true,
      formatAutoElipsis: false
    },
    menuToggle: { }
  }
}

const getters = {
  data: state => state.data,
  theme: state => state.data.theme,
  dashboardDetails: state => state.data.dashboardDetails,
  dashboardSettings: state => state.data.dashboardSettings,
  globalSettings: state => state.data.globalSettings,
  traderSettings: state => state.data.traderSettings,
  menuToggle: state => id => !!state.data.menuToggle[id]
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
  },
  [SETTINGS_TRADER_SETTINGS_SET]: (state, settings) => {
    state.data.traderSettings = settings
  },
  [SETTINGS_MENU_TOGGLE_SET]: (state, toggle) => {
    state.data.menuToggle[toggle.id] = toggle.state
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
