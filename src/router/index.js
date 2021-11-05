import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import store from '@/store'

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

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/isAuthenticated']) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
