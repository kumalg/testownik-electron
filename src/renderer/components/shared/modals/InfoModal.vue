<template>
<Modal @close="$emit('close')">
  <div slot="body">
    <h2>Testownik</h2>
    <p>Autor: Kamil Golec</p>
    <p>Wersja: {{ appVersion }}</p>
  </div>
</Modal>
</template>

<script>
import Modal from '@/components/shared/Modal'
const appVersion = require('electron').remote.app.getVersion()
export default {
  components: {
    Modal
  },
  data () {
    return {
      appVersion
    }
  }
}
</script>

<style lang="scss">
@import "@/style/_colors.scss";
</style>
