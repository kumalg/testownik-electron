import Vue from 'vue'
import Vuex from 'vuex'
import settings from 'electron-settings'

Vue.use(Vuex)

const state = {
  theme: settings.get('theme') || 'light',
  controlsTheme: settings.get('controlsTheme') || 'win',
  reverseControlsLocation: settings.get('reverseControlsLocation') || false,

  reoccurrencesIfBad: settings.get('reoccurrencesIfBad') || 1,
  reoccurrencesOnStart: settings.get('reoccurrencesOnStart') || 2,
  maxReoccurrences: settings.get('maxReoccurrences') || 10
}

const mutations = {
  setTheme (state, theme) {
    state.theme = theme
  },
  setControlsTheme (state, controlsTheme) {
    state.controlsTheme = controlsTheme
  },
  setReverseControlsLocation (state, reverseControlsLocation) {
    state.reverseControlsLocation = reverseControlsLocation
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
  setControlsTheme ({ commit }, controlsTheme) {
    commit('setControlsTheme', controlsTheme)
  },
  setReverseControlsLocation ({ commit }, reverseControlsLocation) {
    commit('setReverseControlsLocation', reverseControlsLocation)
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
