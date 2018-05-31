<template>
<Modal @close="$emit('close')" :theme="theme">
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
      <label class="custom-radio-button section-option" :theme="theme">
        <input class="custom-radio-button" type="radio" v-model="theme" value="legacy">
        <span class="helping-el"></span>
        <span class="label-text">Klasyczny</span>
      </label>
    </div>
    <div class="section">
      <div class="section-title">
        <span>Pasek tytułu</span>
      </div>
      <v-select
        class="v-select"
        :theme="theme"
        :options="controlThemes"
        :selectedOption.sync="controlsTheme"
      />
      <label class="custom-checkbox section-option" :theme="theme">
        <input class="custom-radio-button" type="checkbox" v-model="reverseControlsLocation">
        <span class="helping-el"></span>
        <span class="label-text">Przyciski po lewej stronie</span>
      </label>
    </div>
    <div class="section">
      <div class="section-title">
        <span>Quiz</span>
      </div>
      <div class="section-option">
        <label for="reoccurrences-if-bad-input">Liczba dodatkowych powtórzeń przy błędnej odpowiedzi</label>
        <input
          :theme="theme"
          class="custom-input line"
          id="reoccurrences-if-bad-input"
          type="number"
          min="0"
          max="10"
          step="1"
          v-model.number="reoccurrencesIfBad"
          @blur="reoccurrencesIfBadBlurred">
      </div>
      <div class="section-option">
        <label for="reoccurrences-on-start-input">Wstępna liczba powtórzeń</label>
        <input
          :theme="theme"
          class="custom-input line"
          id="reoccurrences-on-start-input"
          type="number"
          min="1"
          max="10"
          step="1"
          v-model.number="reoccurrencesOnStart"
          @blur="reoccurrencesOnStartBlurred">
      </div>
      <div class="section-option">
        <label for="max-reoccurrences-input">Maksymalna liczba powtórzeń</label>
        <input
          :theme="theme"
          class="custom-input line"
          id="max-reoccurrences-input"
          type="number"
          min="1"
          max="10"
          step="1"
          v-model.number="maxReoccurrences"
          @blur="maxReoccurrencesBlurred">
      </div>
    </div>
  </div>
</Modal>
</template>

<script>
import Modal from '@/components/shared/Modal'
import VSelect from '@/components/shared/v-select'
import { controlThemes } from '@/constants.js'

export default {
  components: {
    Modal,
    VSelect
  },
  data () {
    return {
      controlThemes,
      theme: this.$store.state.theme,
      controlsTheme: controlThemes.find(i => i.value === this.$store.state.controlsTheme),
      reverseControlsLocation: this.$store.state.reverseControlsLocation,
      reoccurrencesIfBad: this.$store.state.reoccurrencesIfBad,
      reoccurrencesIfBadFocused: false,
      reoccurrencesOnStart: this.$store.state.reoccurrencesOnStart,
      reoccurrencesOnStartFocused: false,
      maxReoccurrences: this.$store.state.maxReoccurrences,
      maxReoccurrencesFocused: false
    }
  },
  methods: {
    reoccurrencesIfBadBlurred () {
      const int = parseInt(this.reoccurrencesIfBad)
      if (!int || int <= 0) this.reoccurrencesIfBad = 0
      else if (int > 10) this.reoccurrencesIfBad = 10
    },
    reoccurrencesOnStartBlurred () {
      if (this.reoccurrencesOnStart < 1) this.reoccurrencesOnStart = 1
      else if (this.reoccurrencesOnStart > 10) this.reoccurrencesOnStart = 10
    },
    maxReoccurrencesBlurred () {
      if (this.maxReoccurrences < 1) this.maxReoccurrences = 1
      else if (this.maxReoccurrences > 10) this.maxReoccurrences = 10
    }
  },
  watch: {
    theme (value) {
      this.$store.dispatch('setTheme', value)
    },
    controlsTheme (value) {
      this.$store.dispatch('setControlsTheme', value.value)
    },
    reverseControlsLocation (value) {
      this.$store.dispatch('setReverseControlsLocation', value)
    },
    reoccurrencesIfBad (value) {
      const int = parseInt(value)
      if (int >= 0 && int <= 10) this.$store.dispatch('setReoccurrencesIfBad', int)
    },
    reoccurrencesOnStart (value) {
      const int = parseInt(value)
      if (int >= 1 && int <= 10) this.$store.dispatch('setReoccurrencesOnStart', int)
    },
    maxReoccurrences (value) {
      const int = parseInt(value)
      if (int >= 1 && int <= 10) this.$store.dispatch('setMaxReoccurrences', int)
    }
  }
}
</script>

<style lang="scss">
@import "@/style/_colors.scss";

.section {
  margin: 24px 0;

  .section-title {
    margin-bottom: 8px;
    font-size: 1.1em;
    font-weight: 400;
  }
  .section-option {
    display: block;
    margin: 4px 0;

    select,
    input[type=text],
    input[type=number] {
      display: block;
      width: 100%;
    }

    label {
      margin-top: 8px;
      display: block;
      color: var(--secondary-text);
      text-transform: uppercase;
      font-size: .75em;
      font-weight: 700;
    }
  }
  .v-select {
    margin: 0 0 16px 0;
  }
}
</style>
