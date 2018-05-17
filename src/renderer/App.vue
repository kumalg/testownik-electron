<template>
  <div id="app" :theme="$store.state.theme">
    <Titlebar
      :theme="$store.state.theme"
      :controlsTheme="$store.state.controlsTheme"
      :reverseControlsLocation="$store.state.reverseControlsLocation"
    />
    <SettingsModal v-if="showSettingsModal" @close="showSettingsModal = false"/>
    <InfoModal v-if="showInfoModal" @close="showInfoModal = false"/>
    <transition name="page-component-fade" mode="out-in">
      <router-view 
        @showSettings="showSettingsModal = true"
        @showInfo="showInfoModal = true"
      />
    </transition>
  </div>
</template>

<script>
import Titlebar from '@/components/titlebar/Titlebar'
import SettingsModal from '@/components/SettingsModal'
import InfoModal from '@/components/InfoModal'

export default {
  name: 'testownik-electron',
  components: {
    Titlebar,
    SettingsModal,
    InfoModal
  },
  data () {
    return {
      showSettingsModal: false,
      showInfoModal: false
    }
  }
}
</script>

<style lang="scss">
@import "style/_colors.scss";
@import "style/ui_elements.scss";
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Open Sans', sans-serif;
  overflow-y: hidden;
}

#app {
  background: $background-lighter;
  overflow-y: hidden;
  &[theme=dark] {
    background: $background-darker;
  }
}

.page-component-fade-enter-active {
  transition: all 0.2s ease-out;
}
.page-component-fade-leave-active {
  transition: all 0.2s ease-in;
}
.page-component-fade-enter,
.page-component-fade-leave-to {
  opacity: 0;
}
.page-component-fade-enter {
  transform: translateX(32px);
}
.page-component-fade-leave-to {
  transform: translateX(-32px);
}
</style>
