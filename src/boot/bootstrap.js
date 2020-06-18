// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'src/assets/sing-app/css/app.css'
import 'src/assets/sing-app/css/chunk-vendors.css'
// import 'src/assets/light-blue/css/app.css'
// import 'src/assets/light-blue/css/chunk-vendors.css'

import * as VueGoogleMaps from 'vue2-google-maps'
import VueTouch from 'vue-touch'
import Trend from 'vuetrend'
import Toasted from 'vue-toasted'
import VueApexCharts from 'vue-apexcharts'
import layoutMixin from 'src/mixins/layout'
import Widget from 'src/components/Widget/Widget'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // Install BootstrapVue
  Vue.use(BootstrapVue)
  Vue.use(BootstrapVue)
  Vue.use(VueTouch)
  Vue.use(Trend)
  Vue.component('Widget', Widget)
  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg',
    },
  })
  Vue.component('apexchart', VueApexCharts)
  Vue.mixin(layoutMixin)
  Vue.use(Toasted, {duration: 10000})

  // Optionally install the BootstrapVue icon components plugin
  Vue.use(BootstrapVueIcons)
}
