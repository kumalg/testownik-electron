<template>
  <div :class="['titlebar-osx-controls', {'titlebar-controls-dark': theme === 'dark' || theme === 'legacy'}]">
    <div class="titlebar-minimize" @click="$emit('minimize')">
      <svg x="0px" y="0px" viewBox="0 0 8 8">
        <path d="M8,4.002C8,4.555,7.553,5,7,5H1C0.448,5,0,4.555,0,4.002l0,0c0-0.553,0.447-1,1-1h6C7.553,3.002,8,3.45,8,4.002L8,4.002z"/>
      </svg>
    </div><div class="titlebar-resize" @click="$emit('resize')">
      <svg x="0px" y="0px" viewBox="0 0 8 8">
        <path d="M5.59,7H2C1.45,7,1,6.55,1,6V2.41L5.59,7z"/>
        <path d="M7,2v3.59L2.41,1H6C6.55,1,7,1.45,7,2z"/>
      </svg>
    </div><div class="titlebar-close" @click="$emit('close')">
      <svg x="0px" y="0px" viewBox="0 0 8 8">
        <path d="M6.829,5.414L5.415,4l1.414-1.413c0.391-0.391,0.391-1.023,0-1.414c-0.391-0.391-1.023-0.391-1.414,0L4.001,2.587
          L2.587,1.172c-0.391-0.391-1.023-0.391-1.414,0c-0.391,0.391-0.391,1.023,0,1.414l1.416,1.415L1.172,5.417
          c-0.391,0.391-0.391,1.023,0,1.414C1.563,7.222,2.196,7.222,2.586,6.83l1.415-1.416l1.414,1.414c0.391,0.392,1.023,0.392,1.414,0
          C7.22,6.438,7.22,5.806,6.829,5.414z"/>
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
@import '@/style/_colors.scss';

$color: rgba(0,0,0,.5);
$color-dark: rgba($secondary-text-ondark,0.25);

.titlebar-osx-controls {
  margin: 0 8px; 
  path {
    fill: $color;
  }
  &.titlebar-controls-dark {
    path {
      fill: $color-dark;
    }
    .titlebar-close {
      &:not(:hover) {
        background: $color-dark;
      }
      path {
        fill: $background-darker;
      }
    }
  }
}
.titlebar-close,
.titlebar-minimize,
.titlebar-resize {
  display: inline-block;
  margin: 9px 8px;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 14px;
  font-size: 10px;
  transition: background .2s ease;
}
.titlebar-close {
  border-radius: 7px;
}

.titlebar-close {
  background: $color;
  &:hover {
    background: #d05c73;
  }
  &:active {
    background: lighten(#d05c73,5%);
  }
  path {
    fill: $background-lighter;
  }
}

.titlebar-minimize {
  &:active {
  }
}

.titlebar-resize {
  &:active {
  }
}

svg {
  width: 8px;
  height: 8px;
  // shape-rendering: crispEdges;
}
</style>
