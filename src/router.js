import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import RegisterUser from "@/views/RegisterUser"
import LoginUser from "@/views/LoginUser"

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUser
    }
  ]
})

router.beforeEach(( to, from, next ) => {
  const loggedIn = localStorage.getItem( 'user' )
  // to.matched.some method explained in VueMastery Token-Based Authentication 5. User Logout 5:00min
  if ( to.matched.some( record => record.meta.requiresAuth ) && !loggedIn ) {
    next( '/' )
  } else {
    next()
  }
})

export default router
