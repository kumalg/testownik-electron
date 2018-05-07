import Vue from 'vue'
import Vuex from 'vuex'
import settings from 'electron-settings'

Vue.use(Vuex)

const state = {
  theme: settings.get('theme') || 'light',
  reoccurrencesIfBad: settings.get('reoccurrencesIfBad') || 1,
  reoccurrencesOnStart: settings.get('reoccurrencesOnStart') || 2,
  maxReoccurrences: settings.get('maxReoccurrences') || 10

}

const mutations = {
  setTheme (state, theme) {
    state.theme = theme
  },
  setReoccurrencesIfBad (state, value) {
    state.reoccurrencesIfBad = value
  },
  setReoccurrencesOnStart (state, value) {
    state.reoccurrencesOnStart = value
  },
  setMaxReoccurrences (state, value) {
    state.maxReoccurrences = value
  }
}

const actions = {
  setTheme ({ commit }, theme) {
    commit('setTheme', theme)
  },
  setReoccurrencesIfBad ({ commit }, value) {
    commit('setReoccurrencesIfBad', value)
  },
  setReoccurrencesOnStart ({ commit }, value) {
    commit('setReoccurrencesOnStart', value)
  },
  setMaxReoccurrences ({ commit }, value) {
    commit('setMaxReoccurrences', value)
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
