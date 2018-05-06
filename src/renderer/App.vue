<template>
  <div id="app">
    <transition name="page-component-fade" mode="out-in">
      <router-view></router-view>
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

.page-component {
  &-fade-enter-active,
  &-fade-leave-active {
    transition: all 0.2s ease;
  }
  &-fade-enter,
  &-fade-leave-to {
    opacity: 0;
  }
  &-fade-enter {
    transform: translateX(8px);
  }
  &-fade-leave-to {
    transform: translateX(-8px);
  }
}
</style>
