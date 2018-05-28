<template>
<Modal @close="$emit('close')">
  <div slot="body">
    <h2>Testownik</h2>
    <p>Autor: Kamil Golec</p>
    <p>Wersja: {{ appVersion }}</p>
    <i v-if="updateAvailable">Dostępna nowsza wersja</i>
    <i v-else>Zainstalowano najnowszą wersję</i>
  </div>
</Modal>
</template>

<script>
import { autoUpdater } from 'electron-updater'
import Modal from '@/components/shared/Modal'
const appVersion = require('electron').remote.app.getVersion()

export default {
  components: {
    Modal
  },
  data () {
    return {
      appVersion,
      updateAvailable: false
    }
  },
  mounted () {
    autoUpdater.checkForUpdates()
    autoUpdater.on('update-available', (resp) => {
      this.updateAvailable = true
      console.log(resp)
    })
  }
}
</script>

<style lang="scss">
@import "@/style/_colors.scss";
</style>
