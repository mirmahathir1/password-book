import Vue from 'vue'
import Vuex from 'vuex'

import auth from "./modules/auth";
import apikey from "./modules/apikey";
import notification from "./modules/notification";
import entries from "./modules/entries";
import routerControl from "./modules/routerControl";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    routerControl,
    auth,
    apikey,
    notification,
    entries,
  }
})
