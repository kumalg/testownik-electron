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
import SettingsModal from '@/components/shared/modals/SettingsModal'
import InfoModal from '@/components/shared/modals/InfoModal'

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
@import "@/style/_colors.scss";

#app[theme=light] {
  --primary-text: rgba(0,0,0,.75);
  --secondary-text: rgba(0,0,0,.4);
  --main-window-background: #fafafa;
  --sidebar-background: #eee;
  --answer-single-type-background: #fff;

  --drag-border-color: rgba(0,0,0,.1);
  --drag-background: rgba(0, 0, 0, 0.02);
  --drag-over-background: rgba(0, 0, 0, 0.05);
}
#app[theme=dark] {
  --primary-text: rgba(255,255,255,.75);
  --secondary-text: rgba(255,255,255,.4);
  --main-window-background: #21252b;
  --sidebar-background: #1a1e22;
  --answer-single-type-background: #1d2025;

  --drag-border-color: rgba(255,255,255,.1);
  --drag-background: rgba(255,255,255,.02);
  --drag-over-background: rgba(255,255,255,.04);
}
#app[theme=legacy] {
  --primary-text: rgba(255,255,255,.75);
  --secondary-text: rgba(255,255,255,.4);
  --main-window-background: #075098;
  --sidebar-background: #06488a;
  --answer-single-type-background: #ffffff;

  --drag-border-color: rgba(255,255,255,.1);
  --drag-background: rgba(255,255,255,.02);
  --drag-over-background: rgba(255,255,255,.04);
}
#app {
  color: var(--primary-text);
  background: var(--main-window-background);
}
.main-window-theme {
  background: var(--main-window-background);
}
.sidebar-theme {
  background: var(--sidebar-background);
}
.answer-single-type-theme {
  background: var(--answer-single-type-background);
}
.drag-theme {
  border-color: var(--drag-border-color);
  background: var(--drag-background);
  color: var(--secondary-text);
}
.drag-over-theme {
  background: var(--drag-over-background);
}
</style>

<style lang="scss">
@import "@/style/_colors.scss";
@import "@/style/ui_elements.scss";
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
  // background: $background-lighter;
  &, span {
    color: $primary-text;
  }
  overflow-y: hidden;
  &[theme=dark] {
    // background: $background-darker;
    &, span {
      color: $primary-text-ondark;
    }
  }
  &[theme=legacy] {
    // background: $background-darker;
    &, span {
      color: $primary-text-ondark;
    }
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

// #app {
//   &[theme=dark] {
//     .themed-background {
//       background: $background-light;
//     }
//   }

//   .themed-background {
//     background: $background-light;
//   }
  
//   .themed-background_ {
//     background: $background-light;
//   }
// }
</style>
