<template>
  <div id="app">
    <transition name="page-component-fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'testownik-electron'
  }
</script>

<style lang="scss">
.titlebar {
  position: fixed;
  width: 100%;
  z-index: 9999;
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
