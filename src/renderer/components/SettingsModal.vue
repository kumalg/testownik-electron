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
        <input :theme="theme" class="custom-input line" id="reoccurrences-if-bad-input" type="number" min="0" max="10" v-model.number="reoccurrencesIfBad">
      </div>
      <div class="section-option">
        <label for="reoccurrences-on-start-input">Wstępna liczba powtórzeń</label>
        <input :theme="theme" class="custom-input line" id="reoccurrences-on-start-input" type="number" min="0" max="10" v-model.number="reoccurrencesOnStart">
      </div>
      <div class="section-option">
        <label for="max-reoccurrences-input">Maksymalna liczba powtórzeń</label>
        <input :theme="theme" class="custom-input line" id="max-reoccurrences-input" type="number" min="0" max="10" v-model.number="maxReoccurrences">
      </div>
    </div>
  </div>
</Modal>
</template>

<script>
import Modal from '@/components/Modal'
import VSelect from '@/components/v-select'
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
      reoccurrencesOnStart: this.$store.state.reoccurrencesOnStart,
      maxReoccurrences: this.$store.state.maxReoccurrences
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

div[theme=dark] {
  .section {
    .section-option {
      label {
        display: block;
        color: rgba(255,255,255,.5);
        text-transform: uppercase;
        font-size: .75em;
        font-weight: 700;
      }
    }
  }
}

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
      color: rgba(0,0,0,.5);
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
