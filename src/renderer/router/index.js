import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: require('@/components/Quiz').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
