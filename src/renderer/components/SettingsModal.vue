<template>
<Modal @close="$emit('close')">
  <div slot="header">
    <h3>Ustawienia</h3>
  </div>
  <div slot="body">
    <div class="section">
      <div class="section-title">
        <span>Motyw</span>
      </div>
      <label class="custom-radio-button section-option" :theme="theme">
        <input class="custom-radio-button" type="radio" v-model="theme" value="dark">
        <span class="helping-el"></span>
        <span class="label-text">Ciemny</span>
      </label>
      <label class="custom-radio-button section-option" :theme="theme">
        <input class="custom-radio-button" type="radio" v-model="theme" value="light">
        <span class="helping-el"></span>
        <span class="label-text">Jasny</span>
      </label>
    </div>
    <div class="section">
      <div class="section-title">
        <span>Pasek tytułu</span>
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
        <span>Quiz</span>
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

.section {
  margin: 16px 0;
  .section-title {
    margin-bottom: 8px;
    font-size: 1.1em;
    font-weight: 400;
  }
  .section-option {
    display: block;
    margin: 4px 0;
    font-size: .875em;

    select,
    input[type=text],
    input[type=number] {
      display: block;
      width: 100%;
    }
  }
}
</style>
