import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import store from '@/store'
import { RUNTIME_SIDEBAR_SET } from '@/store/actions/runtime'
import { AUTH_CHECK } from '@/store/actions/auth'

Vue.use(Router)

const router = new Router({
  base: location.pathname,
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/chart/:type',
      name: 'Chart',
      component: () => import('@/views/Chart.vue')
    },
    {
      path: '/trader/:symbol',
      name: 'Trader',
      component: () => import('@/views/Trader.vue')
    },
    {
      path: '/trades',
      name: 'TradesClassic',
      component: () => import('@/views/Trades.vue')
    },
    {
      path: '/trades-modern',
      name: 'TradesModern',
      component: () => import('@/views/TradesModern.vue')
    },
    {
      path: '/performance',
      name: 'Performance',
      component: () => import('@/views/Performance.vue')
    },
    {
      path: '/carousel',
      name: 'Carousel',
      component: () => import('@/views/Carousel.vue')
    },
    {
      path: '/debug',
      name: 'Debug',
      component: () => import('@/views/Debug.vue'),
      meta: {
        admin: true
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/admin/Admin.vue'),
      meta: {
        admin: true
      }
    },
    {
      path: '/utilization',
      name: 'Utilization',
      component: () => import('@/views/admin/Utilization.vue'),
      meta: {
        admin: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: {
        public: true
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue')
    }
  ]
})

let loaded = false

const mobileThreshold = 1100

const isMobile = function () {
  return window.innerWidth < mobileThreshold
}

const navigate = function (next, delay) {
  if (delay) {
    setTimeout(next, 500)
  } else {
    next()
  }
}

router.beforeEach(async (to, _from, next) => {
  if (!loaded) {
    await store.dispatch('auth/' + AUTH_CHECK)
    loaded = true
  }

  const delay = store.getters['runtime/sidebar'] && isMobile()
  if (delay) {
    store.commit('runtime/' + RUNTIME_SIDEBAR_SET, false)
  }

  const navigateRole = function (role) {
    if (store.getters[role]) {
      navigate(next, delay)
    } else {
      navigate(() => next({ path: '/login', query: { redirect: to.fullPath } }), delay)
    }
  }

  if (to.matched.every(x => x.meta.public)) {
    navigate(next, delay)
  } else if (to.matched.some(x => x.meta.admin)) {
    navigateRole('auth/admin')
  } else {
    navigateRole('auth/viewer')
  }
})

export default router
