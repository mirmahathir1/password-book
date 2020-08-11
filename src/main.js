import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vuelidate from "vuelidate";
import VueClipboard from 'vue-clipboard2'
import AOS from 'aos'
import 'aos/dist/aos.css'


Vue.use(VueClipboard);

Vue.use(Vuelidate);


// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

axios.defaults.baseURL = 'https://identitytoolkit.googleapis.com';

Vue.config.productionTip = false

const app = new Vue({
  created() {
    AOS.init();
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')

store.$vm = app;
