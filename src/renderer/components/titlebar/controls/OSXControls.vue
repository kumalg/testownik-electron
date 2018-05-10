<template>
  <div :class="['titlebar-osx-controls', {'titlebar-controls-dark': theme === 'dark'}]">
    <div class="titlebar-close" @click="$emit('close')">

    </div><div class="titlebar-minimize" @click="$emit('minimize')">

    </div><div class="titlebar-resize" @click="$emit('resize')">

    </div>
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: 'light'
    },
    isMaximized: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.titlebar-osx-controls {
  margin: 0 6px;
}
.titlebar-close,
.titlebar-minimize,
.titlebar-resize {
  display: inline-block;
  margin: 10px 4px;
  width: 12px;
  height: 12px;
  background: red;
  border-radius: 6px;
  border: {
    style: solid;
    width: 1px;
    color: green;
  }
}

.titlebar-close {
  background: #fc605b;
  border-color: #df4a47;
}

.titlebar-minimize {
  background: #fdbf41;
  border-color: #dfa12e;
}

.titlebar-resize {
  background: #33c849;
  border-color: #22ab36;
}
</style>
