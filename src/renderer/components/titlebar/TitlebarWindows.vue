<template>
<div :class="['titlebar draggable', {'fullscreen': isMaximized}, {'titlebar-light': $store.state.theme === 'dark'}]">
  <div class="titlebar-controls">
    <div class="titlebar-minimize" @click="minimize">
      <svg x="0px" y="0px" viewBox="0 0 10 1">
        <rect width="10" height="1"></rect>
      </svg>
    </div>
    <div class="titlebar-resize" @click="resize">
      <svg class="fullscreen-svg" x="0px" y="0px" viewBox="0 0 10 10">
        <path d="M 0 0 L 0 10 L 10 10 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 9 L 1 9 L 1 1 z "></path>
      </svg>
      <svg class="maximize-svg" x="0px" y="0px" viewBox="0 0 10 10">
        <path d="M10,0H2v2H0v8h8V8h2V0z M7,9H1V3h6V9z M9,7H8V2H3V1h6V7z"/>
      </svg>
    </div>
    <div class="titlebar-close" @click="close">
      <svg x="0px" y="0px" viewBox="0 0 10 10">
        <polygon points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5"></polygon>
      </svg>
    </div>
  </div>
</div>
</template>

<script>
import { remote } from 'electron'
const browserWindow = remote.getCurrentWindow()

export default {
  data () {
    return {
      isMaximized: browserWindow.isMaximized()
    }
  },
  methods: {
    minimize () {
      browserWindow.minimize()
    },
    resize () {
      if (browserWindow.isMaximized()) {
        browserWindow.unmaximize()
      } else {
        browserWindow.maximize()
      }
    },
    close () {
      browserWindow.close()
    }
  },
  mounted () {
    browserWindow.on('maximize', () => {
      this.isMaximized = true
    })
    browserWindow.on('unmaximize', () => {
      this.isMaximized = false
    })
  }
}
</script>

<style lang="scss" scoped>
.titlebar {
  display: block;
  position: fixed;
  width: 100%;
  z-index: 9999;
  // position: relative;
  height: 32px;
  padding: 0;
}

.titlebar.draggable {
  -webkit-app-region: drag;
}

.titlebar-controls {
  float: right;
  text-align: left;
}

.titlebar:after,
.titlebar-controls:after {
  content: " ";
  display: table;
  clear: both;
}

.titlebar-minimize,
.titlebar-resize,
.titlebar-close {
  float: left;
  width: 45px;
  height: 31px;
  margin: 1px 1px 0 0;
  text-align: center;
  line-height: 29px;
  transition: background-color 0.2s;
}

.titlebar.draggable .titlebar-minimize,
.titlebar.draggable .titlebar-resize,
.titlebar.draggable .titlebar-close {
  -webkit-app-region: no-drag;
}

.titlebar-minimize svg,
.titlebar-resize svg.maximize-svg,
.titlebar-resize svg.fullscreen-svg,
.titlebar-close svg {
  width: 10px;
  height: 10px;
  shape-rendering: crispEdges;
}

.titlebar:not(.fullscreen) svg.maximize-svg {
  display: none;
}

.titlebar.fullscreen svg.fullscreen-svg {
  display: none;
}

.titlebar-minimize:hover,
.titlebar-resize:hover,
.titlebar-fullscreen:hover {
  background-color: rgba(0, 0, 0, .05);
}

.titlebar-light .titlebar-minimize:hover,
.titlebar-light .titlebar-resize:hover,
.titlebar-light .titlebar-fullscreen:hover {
  background-color: rgba(255, 255, 255, .05);
}

.titlebar-close:hover {
  background-color: rgba(232, 17, 35, 0.9);
}

.titlebar-close:hover svg polygon {
  fill: rgba(255, 255, 255, 1);
}

.titlebar-light .titlebar-close:hover {
  fill: rgba(0, 0, 0, 1);
}

.titlebar svg polygon,
.titlebar svg rect,
.titlebar svg > path {
  fill: rgba(0, 0, 0, .5);
  transition: fill .2s;
}

.titlebar-light svg polygon,
.titlebar-light svg rect,
.titlebar-light svg > path {
  fill: rgba(255, 255, 255, .5);
}

.titlebar-light .titlebar-close:hover {
  background-color: rgba(232, 17, 35, 0.9);
}
</style>
