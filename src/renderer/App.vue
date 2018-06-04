<template>
  <div id="app" :theme="$store.state.theme">
    <Titlebar
      :theme="$store.state.theme"
      :controlsTheme="$store.state.controlsTheme"
      :reverseControlsLocation="$store.state.reverseControlsLocation"
    />
    <SettingsModal v-if="showSettingsModal" @close="showSettingsModal = false"/>
    <InfoModal v-if="showInfoModal" @close="showInfoModal = false"/>
    <WhatsNewModal v-if="showWhatsNewModal" @close="showWhatsNewModal = false"/>
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
import WhatsNewModal from '@/components/shared/modals/WhatsNewModal'
import settings from 'electron-settings'
// import { shell } from 'electron'
const appVersion = require('electron').remote.app.getVersion()

export default {
  name: 'testownik-electron',
  components: {
    Titlebar,
    SettingsModal,
    InfoModal,
    WhatsNewModal
  },
  data () {
    return {
      showSettingsModal: false,
      showInfoModal: false,
      showWhatsNewModal: false
    }
  },
  mounted () {
    if (settings.get('lastVersion') !== appVersion) {
      this.showWhatsNewModal = true
      settings.set('lastVersion', appVersion)
    }
    // shell.on('click', 'a[href^="http"]', (event) => {
    //   alert('mamcie')
    //   event.preventDefault()
    //   shell.openExternal(this.href)
    // })
  }
}
</script>

<style lang="scss">
@import "@/style/_colors.scss";
$primary-color: #39b54a;

#app {
  --green-color: #39b54a;
  --yellow-color: rgb(255, 219, 58);
  --red-color: rgb(241, 81, 81);

  --primary-color: #{$primary-color};
  --primary-color-lighter: #{lighten($primary-color, 2)};
  --primary-color-lightest: #{lighten($primary-color, 5)};
}
 
#app[theme=light] {
  --primary-text: rgba(0,0,0,.75);
  --secondary-text: rgba(0,0,0,.4);
  --distant-text: rgba(0,0,0,.2);

  --background: #eee;
  --background-2: #fafafa;
  --background-3: #fff;

  --max-color: 255, 255, 255;
  --contrast-color: 0, 0, 0;

  // specific
  --main-window-background: var(--background-2);
  --sidebar-background: var(--background);
  --answer-single-type-background: var(--background-3);
  --answer-single-type-checked-border-color: rgba(0, 0, 0, 0.25);

  --drag-border-color: rgba(0,0,0,.1);
  --drag-background: rgba(0, 0, 0, 0.02);
  --drag-over-background: rgba(0, 0, 0, 0.05);

  --modal-background: var(--background-2);
  --modal-mask: var(--background);

  --v-select-list-background: var(--background-3);
  --v-select-list-hover: rgba(0,0,0,.05);
}
#app[theme=dark] {
  $background: #21252b;

  --primary-text: rgba(255,255,255,.75);
  --secondary-text: rgba(255,255,255,.4);
  --distant-text: rgba(255,255,255,.2);

  --background: #{$background};
  --background-2: #{darken($background, 2)};
  --background-3: #{darken($background, 3)};

  --max-color: 0, 0, 0;
  --contrast-color: 255, 255, 255;

  // specific
  --main-window-background: var(--background);
  --sidebar-background: var(--background-3);
  --answer-single-type-background: var(--background-2);
  --answer-single-type-checked-border-color: rgba(255, 255, 255, 0.15);

  --drag-border-color: rgba(255,255,255,.1);
  --drag-background: rgba(255,255,255,.02);
  --drag-over-background: rgba(255,255,255,.04);

  --modal-background: var(--background);
  --modal-mask: var(--background-3);

  --v-select-list-background: var(--background-2);
  --v-select-list-hover: var(--background-3);
}
#app[theme=legacy] {
  --green-color: rgb(0,255,0);
  --yellow-color: rgb(255, 255, 0);
  --red-color: rgb(255, 0, 0);

  --primary-color: #00ff00;
  --primary-color-lighter: #{lighten(#00ff00, 2)};
  --primary-color-lightest: #{lighten(#00ff00, 5)};

  --primary-text: rgba(255,255,255,1);
  --secondary-text: rgba(255,255,255,.6);
  --distant-text: rgba(255,255,255,.4);

  --background: #075098;
  --background-2: #{mix(#075098, #06488a)};
  --background-3: #06488a;

  --max-color: 0, 0, 0;
  --contrast-color: 255, 255, 255;

  // specific
  --main-window-background: var(--background);
  --sidebar-background: var(--background-3);
  --answer-single-type-background: #ffffff;
  --answer-single-type-checked-border-color: rgba(255, 255, 255, 0.15);

  --drag-border-color: rgba(255,255,255,.1);
  --drag-background: rgba(255,255,255,.02);
  --drag-over-background: rgba(255,255,255,.04);

  --modal-background: var(--background);
  --modal-mask: var(--background-3);

  --v-select-list-background: var(--background-2);
  --v-select-list-hover: var(--background-3);
}
.answer-single-type-theme {
  background: var(--answer-single-type-background);
}
</style>

<style lang="scss">
@import "@/style/_colors.scss";
@import "@/style/ui_elements.scss";
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

button {
  outline: none;
}

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
  background: var(--main-window-background);
  overflow-y: hidden;
  &, span {
    color: var(--primary-text);
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
