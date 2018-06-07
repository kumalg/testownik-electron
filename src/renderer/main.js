import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// import MathJax from 'mathjax-node'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// MathJax.config({
//   MathJax: {
//     jax: ['input/TeX', 'input/MathML', 'input/AsciiMath', 'output/CommonHTML'],
//     extensions: ['tex2jax.js', 'mml2jax.js', 'asciimath2jax.js', 'MathMenu.js', 'MathZoom.js', 'AssistiveMML.js', 'a11y/accessibility-menu.js'],
//     TeX: {
//       extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
//     }
//   }
// })
// MathJax.start()
// Vue.MathJax = Vue.prototype.$MathJax = MathJax

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
