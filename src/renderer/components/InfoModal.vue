<template>
<Modal @close="$emit('close')">
  <div slot="body">
    Autor: Kamil Golec
  </div>
</Modal>
</template>

<script>
import Modal from '@/components/Modal'
export default {
  components: {
    Modal
  }
}
</script>

<style lang="scss">
@import "../style/_colors.scss";
</style>
