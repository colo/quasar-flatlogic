// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'src/assets/sing-app/css/app.css'
import 'src/assets/sing-app/css/chunk-vendors.css'
// import 'src/assets/light-blue/css/app.css'
// import 'src/assets/light-blue/css/chunk-vendors.css'
import layoutMixin from 'src/mixins/layout'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // Install BootstrapVue
  Vue.use(BootstrapVue)
  Vue.mixin(layoutMixin)
  // Optionally install the BootstrapVue icon components plugin
  // Vue.use(IconsPlugin)
}
