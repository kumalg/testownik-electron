import Vue from 'vue'
import VueKatex from 'vue-katex'
import axios from 'axios'

import 'katex/dist/katex.min.css'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueKatex, {
  globalOptions: {
    delimiters: [
      {left: '$', right: '$', display: false}
    ]
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
