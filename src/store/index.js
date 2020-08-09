import Vue from 'vue'
import Vuex from 'vuex'

import auth from "./modules/auth";
import apikey from "./modules/apikey";
import notification from "./modules/notification";
import entries from "./modules/entries";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    apikey,
    notification,
    entries
  }
})
