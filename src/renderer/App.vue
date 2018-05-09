<template>
  <div id="app">
    <TitlebarWindows/>
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
import TitlebarWindows from '@/components/titlebar/TitlebarWindows'
import SettingsModal from '@/components/SettingsModal'
import InfoModal from '@/components/InfoModal'

export default {
  name: 'testownik-electron',
  components: {
    TitlebarWindows,
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
