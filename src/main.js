import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
// import firebaseApp from './firebase/firebase'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  // firebaseApp,
  render: h => h(App)
}).$mount('#app')
