import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    servers: {},
    originalServers: {},
    currentServer: null,
    currentOriginalServer: null,
    langs: {},
  },
  getters: {
    token: state => state.token,
    isAuthorized: state => !!state.token,
    servers: state => state.servers,
    originalServers: state => state.originalServers,
    currentServer: state => state.currentServer,
    currentOriginalServer: state => state.currentOriginalServer,
    langs: state => state.langs,
  },
  actions: {
    setToken({ state }, token) {
      state.token = token;
    },
    setServers({ state }, servers) {
      state.originalServers = JSON.parse(JSON.stringify(servers));
      state.servers = servers;
    },
    setCurrentServer({ state }, id) {
      state.currentOriginalServer = state.originalServers[id];
      state.currentServer = state.servers[id];
    },
    resetCurrentServer({ state, dispatch }, id) {
      state.servers[id] = JSON.parse(JSON.stringify(state.originalServers[id]));
      dispatch('setCurrentServer', id);
    },
    setLangs({ state }, langs) {
      state.langs = langs;
    },
  },
})
