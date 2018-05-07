import Vue from 'vue'
import Router from 'vue-router'

import LandingPage from '@/components/LandingPage'
import Quiz from '@/components/Quiz'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPage
    },
    {
      path: '/quiz',
      name: 'quiz',
      props: true,
      component: Quiz
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
