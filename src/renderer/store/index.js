import Vue from 'vue'
import Vuex from 'vuex'
import settings from 'electron-settings'

Vue.use(Vuex)

const state = {
  recentFolders: settings.get('recentFolders') || [],

  theme: settings.get('theme') || 'light',
  controlsTheme: settings.get('controlsTheme') || 'win',
  reverseControlsLocation: settings.get('reverseControlsLocation'),

  reoccurrencesIfBad: settings.get('reoccurrencesIfBad') || 0,
  reoccurrencesOnStart: settings.get('reoccurrencesOnStart') || 2,
  maxReoccurrences: settings.get('maxReoccurrences') || 10
}

const mutations = {
  addNewRecentFolder (state, folderPath) {
    state.recentFolders.splice(0, 0, folderPath)
  },
  deleteRecentFolder (state, folderPath) {
    const index = state.recentFolders.indexOf(folderPath)
    if (index !== -1) {
      state.recentFolders.splice(index, 1)
    }
  },
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
  addNewRecentFolder ({ commit }, folderPath) {
    let folders = settings.get('recentFolders')
    const index = folders.indexOf(folderPath)
    if (index > -1) {
      return
    }
    folders.splice(0, 0, folderPath)
    settings.set('recentFolders', folders)
    commit('addNewRecentFolder', folderPath)
  },
  deleteRecentFolder ({ commit }, folderPath) {
    let folders = settings.get('recentFolders')
    const index = folders.indexOf(folderPath)
    if (index === -1) {
      return
    }
    folders.splice(index, 1)
    settings.set('recentFolders', folders)
    commit('deleteRecentFolder', folderPath)
  },
  setTheme ({ commit }, theme) {
    settings.set('theme', theme)
    commit('setTheme', theme)
  },
  setControlsTheme ({ commit }, controlsTheme) {
    settings.set('controlsTheme', controlsTheme)
    commit('setControlsTheme', controlsTheme)
  },
  setReverseControlsLocation ({ commit }, reverseControlsLocation) {
    settings.set('reverseControlsLocation', reverseControlsLocation)
    commit('setReverseControlsLocation', reverseControlsLocation)
  },
  setReoccurrencesIfBad ({ commit }, value) {
    settings.set('reoccurrencesIfBad', value)
    commit('setReoccurrencesIfBad', value)
  },
  setReoccurrencesOnStart ({ commit }, value) {
    settings.set('reoccurrencesOnStart', value)
    commit('setReoccurrencesOnStart', value)
  },
  setMaxReoccurrences ({ commit }, value) {
    settings.set('maxReoccurrences', value)
    commit('setMaxReoccurrences', value)
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
