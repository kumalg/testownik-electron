<template>
  <div :class="['titlebar-windows-controls', {'titlebar-controls-dark': theme !== 'light'}]">
    <div class="titlebar-minimize" @click="$emit('minimize')">
      <svg x="0px" y="0px" viewBox="0 0 10 1">
        <rect width="10" height="1"></rect>
      </svg>
    </div>
    <div class="titlebar-resize" @click="$emit('resize')">
      <svg v-if="isMaximized" class="maximize-svg" x="0px" y="0px" viewBox="0 0 10 10">
        <path d="M10,0H2v2H0v8h8V8h2V0z M7,9H1V3h6V9z M9,7H8V2H3V1h6V7z"/>
      </svg>
      <svg v-else class="fullscreen-svg" x="0px" y="0px" viewBox="0 0 10 10">
        <path d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z "></path>
      </svg>
    </div>
    <div class="titlebar-close" @click="$emit('close')">
      <svg x="0px" y="0px" viewBox="0 0 10 10">
        <polygon points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5"></polygon>
      </svg>
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
$color: rgba(0,0,0,.75);
$color-dark: rgba(255,255,255,.5);

.titlebar-minimize,
.titlebar-resize,
.titlebar-close {
  float: left;
  width: 45px;
  height: 31px;
  margin: 0;
  text-align: center;
  line-height: 29px;
  transition: background-color 0.2s;
}

.titlebar-minimize svg,
.titlebar-resize svg.maximize-svg,
.titlebar-resize svg.fullscreen-svg,
.titlebar-close svg {
  width: 10px;
  height: 10px;
  shape-rendering: crispEdges;
}

.titlebar-minimize,
.titlebar-resize,
.titlebar-fullscreen {
  &:hover {
    background-color: rgba(0, 0, 0, .05);
  }
}

.titlebar-controls-dark {
  .titlebar-backbutton,
  .titlebar-minimize,
  .titlebar-resize,
  .titlebar-fullscreen {
    &:hover {
      background-color: rgba(255, 255, 255, .05);
    }
  }
}

.titlebar-close:hover {
  background-color: rgba(232, 17, 35, 0.9);
  svg polygon {
    fill: rgba(255, 255, 255, 1);
  }
}

.titlebar-controls-dark .titlebar-close:hover {
  fill: rgba(0, 0, 0, 1);
}

.titlebar {
  svg polygon,
  svg rect,
  svg > path {
    fill: $color;
    transition: fill .2s;
  }
}

.titlebar-controls-dark {
  svg polygon,
  svg rect,
  svg > path {
    fill: $color-dark;
  }
}

.titlebar-controls-dark .titlebar-close:hover {
  background-color: rgba(232, 17, 35, 0.9);
}
</style>
