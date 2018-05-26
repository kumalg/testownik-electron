<template>
  <div class="progress-bar-container" :style="{ background: backgroundColor }">
    <div class="progress-bar-progress" :style="{ width: percentageProgressValue + '%', background: color }"></div>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 8
    },
    progress: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#39b54a'
    },
    backgroundColor: {
      type: String,
      default: 'rgba(255,255,255,.1)'
    }
  },
  computed: {
    percentageProgressValue () {
      return this.progress * 100
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar-container {
  display: inline-block;
  width: 150px;
  height: 6px;
  border-radius: 4px;
  transition: background .2s ease;
}
.progress-bar-progress {
  height: 100%;
  border-radius: 4px;
  transition: width .2s ease, background .2s ease;
}
</style>

