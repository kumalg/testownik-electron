<template>
<Modal @close="$emit('close')">
  <div slot="header">
    Ustawienia
  </div>
  <div slot="body">
    <div class="section">
      <div class="section-title">
        Motyw
      </div>
      <div class="section-option">
        <input id="dark-theme-radio" type="radio" v-model="theme" value="dark">
        <label for="dark-theme-radio">Ciemny</label>
      </div>
      <div class="section-option">
        <input id="light-theme-radio" type="radio" v-model="theme" value="light">
        <label for="light-theme-radio">Jasny</label>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        Pasek tytułu
      </div>
      <div class="section-option">
        <label>Styl przycisków</label>
        <select v-model="controlsTheme">
          <option value="win">Windows 10</option>
          <option value="osx">Yosemite</option>
        </select>
      </div>
      <div class="section-option">
        <input id="reverse-controls-checkbox" type="checkbox" v-model="reverseControlsLocation">
        <label for="reverse-controls-checkbox">Przyciski po lewej stronie</label>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        Quiz
      </div>
      <div class="section-option">
        <label for="reoccurrences-if-bad-input">Liczba dodatkowych powtórzeń przy błędnej odpowiedzi</label>
        <input id="reoccurrences-if-bad-input" type="number" min="0" max="10" v-model.number="reoccurrencesIfBad">
      </div>
      <div class="section-option">
        <label for="reoccurrences-on-start-input">Wstępna liczba powtórzeń</label>
        <input id="reoccurrences-on-start-input" type="number" min="0" max="10" v-model.number="reoccurrencesOnStart">
      </div>
      <div class="section-option">
        <label for="max-reoccurrences-input">Maksymalna liczba powtórzeń</label>
        <input id="max-reoccurrences-input" type="number" min="0" max="10" v-model.number="maxReoccurrences">
      </div>
    </div>
  </div>
</Modal>
</template>

<script>
import Modal from '@/components/Modal'
export default {
  components: {
    Modal
  },
  data () {
    return {
      theme: this.$store.state.theme,
      controlsTheme: this.$store.state.controlsTheme,
      reverseControlsLocation: this.$store.state.reverseControlsLocation,
      reoccurrencesIfBad: this.$store.state.reoccurrencesIfBad,
      reoccurrencesOnStart: this.$store.state.reoccurrencesOnStart,
      maxReoccurrences: this.$store.state.maxReoccurrences
    }
  },
  watch: {
    theme (value) {
      this.$store.dispatch('setTheme', value)
    },
    controlsTheme (value) {
      this.$store.dispatch('setControlsTheme', value)
    },
    reverseControlsLocation (value) {
      this.$store.dispatch('setReverseControlsLocation', value)
    },
    reoccurrencesIfBad (value) {
      this.$store.dispatch('setReoccurrencesIfBad', value)
    },
    reoccurrencesOnStart (value) {
      this.$store.dispatch('setReoccurrencesOnStart', value)
    },
    maxReoccurrences (value) {
      this.$store.dispatch('setMaxReoccurrences', value)
    }
  }
}
</script>

<style lang="scss">
@import "../style/_colors.scss";
</style>
