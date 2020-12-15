import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/vi' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@fortawesome/fontawesome-free/css/all.min.css'
import './app.css'

import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'
import formate from './utils/transform'
Vue.component('vue-simplemde', VueSimplemde)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(require('vue-shortkey'))

Vue.config.productionTip = false
window.formate = formate;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
