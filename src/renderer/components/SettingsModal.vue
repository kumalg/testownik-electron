<template>
<Modal @close="$emit('close')">
  <div slot="header">
    Ustawienia
  </div>
  <div slot="body">
    Wygląd
    <input type="radio" @click="setTheme('dark')" name="theme">
    <input type="radio" @click="setTheme('light')" name="theme">
  </div>
</Modal>
</template>

<script>
import settings from 'electron-settings'
import Modal from '@/components/Modal'
export default {
  components: {
    Modal
  },
  methods: {
    setTheme (theme) {
      settings.set('theme', theme)
    }
  }
}
</script>

<style lang="scss">
@import "../style/_colors.scss";
</style>
