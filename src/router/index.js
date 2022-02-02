import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import store from '@/store'
import { RUNTIME_SIDEBAR_SET } from '@/store/actions/runtime'

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
      path: '/carousel',
      name: 'Carousel',
      component: () => import('@/views/Carousel.vue')
    },
    {
      path: '/debug',
      name: 'Debug',
      component: () => import('@/views/Debug.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('@/views/Test.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue')
    }
  ]
})

const mobileThreshold = 1100

const isMobile = function () {
  return window.innerWidth < mobileThreshold
}

const navigate = function (next) {
  if (isMobile()) {
    setTimeout(next, 500)
  } else {
    next()
  }
}

router.beforeEach((to, _from, next) => {
  if (isMobile()) {
    store.commit('runtime/' + RUNTIME_SIDEBAR_SET, false)
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/isAuthenticated']) {
      navigate(next)
      return
    }
    navigate(() => next('/login'))
  } else {
    navigate(next)
  }
})

export default router
