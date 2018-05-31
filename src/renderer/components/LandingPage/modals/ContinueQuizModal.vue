<template>
<Modal @close="$emit('close')">
  <div slot="body" class="body-content">
    <button @click="$emit('new')">
      <i><FontAwesomeIcon :icon="faPlus"/></i>Nowy
    </button><button @click="$emit('continue')">
      <i><FontAwesomeIcon :icon="faPlay"/></i>Kontynuuj
    </button>
  </div>
</Modal>
</template>

<script>
import Modal from '@/components/shared/Modal'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faPlus, faPlay } from '@fortawesome/fontawesome-free-solid'
export default {
  components: {
    Modal,
    FontAwesomeIcon
  },
  data () {
    return {
      faPlus,
      faPlay
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/_colors.scss";

.body-content {
  display: block;
  text-align: center;
  padding: 0;
  margin: 0 -8px;

  button {
    margin: 0 8px;
    width: calc(50% - 16px);
    height: 128px;
    display: inline-block;
    border: none;
    border-radius: 4px;
    font-family: 'Open Sans';
    cursor: pointer;
    background: rgba(var(--contrast-color), .03);
    color: rgba(var(--contrast-color), .6);
    transition: all .2s ease;
    i {
      display: block;
      margin-bottom: 8px;
      font-size: 2em;
      color: rgba(var(--contrast-color), .25);
    }
    &:hover {
      background: rgba(var(--contrast-color), .06);
    }
  }
}
</style>
