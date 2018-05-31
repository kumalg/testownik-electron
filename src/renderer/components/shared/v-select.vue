<template>
<div :class="['custom-select-container', {'custom-select-container-open': opened}]" @click="toggle" @clickout="opened = false" :theme="theme">
  <div :class="['custom-select-toggle', {'line-toggle': lineStyle}]">
    <slot name="selected-option" v-if="selected" v-bind="(typeof selected === 'object')?selected:{[label]: selected}">
      <span>{{ getLabel(selected) }}</span>
    </slot>
    <span v-if="!selected" class="placeholder">{{ placeholder }}</span>
  </div>
  <div class="custom-select-menu">
    <ul>
      <li :class="{'custom-select-menu-item-selected': getValue(selected) === getValue(option)}" v-for="option in options" :key="getValue(option)" @click="clickOption(option)">
        <slot name="option" v-bind="(typeof option === 'object')?option:{[label]: option}">
          <span>{{ getLabel(option) }}</span>
        </slot>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
const getWindow = () => window.document
export default {
  props: {
    selectedOption: {
      default: null
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: String,
      default: 'value'
    },
    label: {
      type: String,
      default: 'label'
    },
    placeholder: {
      type: String,
      default: 'Wybierz opcję'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    lineStyle: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String
    }
  },
  data () {
    return {
      selected: this.selectedOption,
      opened: false
    }
  },
  methods: {
    clickOption (option) {
      if (this.clearable && this.isOptionSelected(option)) {
        this.selected = null
      } else {
        this.selected = option
      }
    },
    isOptionSelected (option) {
      return this.selected == null ? false : this.getValue(this.selected) === this.getValue(option)
    },
    open () {
      this.opened = true
      setTimeout(() => getWindow().addEventListener('click', this.clickOutEvent), 10)
    },
    close () {
      this.opened = false
      getWindow().removeEventListener('click', this.clickOutEvent)
    },
    toggle () {
      if (this.opened) {
        this.close()
      } else {
        this.open()
      }
    },
    clickOutEvent (evt) {
      var $dd = this.$el.children[1]
      if (evt.target !== $dd && !$dd.contains(evt.target)) {
        this.close()
      }
    },
    getValue (option) {
      if (option == null) {
        return ''
      }
      if (typeof option === 'object') {
        if (!option.hasOwnProperty(this.value)) {
          return console.warn(
            `[custom-select warn]: Value key "option.${this.value}" does not` +
            ` exist in options object ${JSON.stringify(option)}.\n`
          )
        }
        if (this.value && option[this.value]) {
          return option[this.value]
        }
      }
      return option
    },
    getLabel (option) {
      if (option == null) {
        return ''
      }
      if (typeof option === 'object') {
        if (!option.hasOwnProperty(this.label)) {
          return console.warn(
            `[custom-select warn]: Label key "option.${this.label}" does not` +
            ` exist in options object ${JSON.stringify(option)}.\n`
          )
        }
        if (this.label && option[this.label]) {
          return option[this.label]
        }
      }
      return option
    }
  },
  watch: {
    selected (value) {
      this.$emit('update:selectedOption', value)
    }
  },
  mounted () {
    if (this.opened) {
      this.open()
    }
  },
  destroyed () {
    getWindow().removeEventListener('click', this.clickOutEvent)
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/_colors.scss';
span {
  font-weight: 600;
}
.placeholder {
  opacity: 0.5;
}
.custom-select-container {
  position: relative;

  &[theme=legacy],
  &[theme=dark] {
    .custom-select-toggle {
      &:after {
        border: {
          color: rgba(255,255,255,.25);
        }
      }
      &.line-toggle {
        border: {
          color: rgba(255,255,255,.1);
        }
      }
    }
    .custom-select-menu {
      box-shadow: none;
    }
  }
  .custom-select-toggle {
    position: relative;
    height: 40px;
    background: #fff;
    box-shadow: 0 4px 16px rgba(#000, .05);
    font-size: .875em;
    font-family: 'Open Sans';
    color: var(--primary-text);
    border: none;
    border-radius: 4px;
    padding: 10px 48px 10px 16px;
    box-sizing: border-box;
    outline: none;
    cursor: pointer;
    &:after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      right: 16px;
      top: 18px;
      box-sizing: border-box;
      transform: rotate(45deg);
      transition: all .2s ease;
      border: {
        style: solid;
        color: rgba(0,0,0,.4);
        width: 0 3px 3px 0;
      }
    }
    &.line-toggle {
      height: 36px;
      background: transparent;
      box-shadow: none;
      border: {
        style: solid;
        color: rgba(0,0,0,.2);
        width: 0 0 2px 0;
        radius: 0;
      }
      padding: 6px 48px 6px 0;
      &:after {
        top: 12px;
        right: 10px;
      }
    }
  }
  .custom-select-menu {
    width: 100%;
    font-size: .8125em;
    font-family: 'Open Sans';
    position: absolute;
    box-shadow: 0 4px 32px rgba(0,0,0,.15);
    background: var(--v-select-list-background);
    border: none;
    border-radius: 4px;
    z-index: 999;
    transition: all .2s ease;
    ul {
      padding: 0;
      margin: 4px 0;
      list-style: none;
      li {
        padding: 8px 16px;
        cursor: pointer;
        transition: background .2s ease;
        &:hover {
          background: var(--v-select-list-hover);
        }
        span {
          color: var(--secondary-text) !important;
        }
      }
      .custom-select-menu-item-selected {
        background: rgba(0,0,0,.05);
        span {
          color: var(--primary-text) !important;
        }
      }
    }
  }
}
.custom-select-container.custom-select-container-open {
  .custom-select-toggle {
    &:after {
      top: 21px;
      transform: rotate(225deg);
    }
    &.line-toggle:after {
      top: 15px;
    }
  }
  .custom-select-menu {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }
}
.custom-select-container:not(.custom-select-container-open) {
  .custom-select-menu {
    visibility: hidden;
    opacity: 0;
    transform: translateY(-16px);
  }
}
.search-container {
  flex: 1;
  max-width: 480px;
  min-width: 128px;
  vertical-align: middle;
  white-space: nowrap;
  position: relative;
  input#search {
    width: 100%;
    max-width: 480px;
    min-width: 128px;
    height: 48px;
    background: red;
    border: none;
    font-size: .875em;
    font-weight: 600;
    font-family: 'Open Sans';
    color: rgba(#000, .5);
    padding-left: 48px;
    border-radius: 4px;
    outline: none;
    transition: background .4s ease;
    &::-webkit-input-placeholder {
      color: #65737e;
    }
    &:-moz-placeholder {
      /* Firefox 18- */
      color: #65737e;
    }
    &::-moz-placeholder {
      /* Firefox 19+ */
      color: #65737e;
    }
    &:-ms-input-placeholder {
      color: #65737e;
    }
    &:hover,
    &:focus,
    &:active {
      outline: none;
    }
  }
  .icon {
    position: absolute;
    margin: 17px;
    font-size: .875em;
    line-height: 1em;
    z-index: 1;
    color: rgba(#000, .5);
    &.reset-icon {
      display: inline;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>