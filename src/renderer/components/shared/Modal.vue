<template>
  <transition name="modal">
    <div class="modal-mask" @mousedown.stop="close" @touchstart.stop="close" :theme="theme">
      <div class="modal-wrapper">
        <div class="modal-container" @mousedown.stop @touchstart.stop>
          
          <div class="modal-header">
            <slot name="header">
              <!-- default header -->
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <!-- Koniec quizu! -->
            </slot>
          </div>

          <div class="modal-footer">
            <button class="modal-default-button" @click="$emit('close')">
              <slot name="modal-footer-button">
                Wyjdź
              </slot>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    close () {
      this.$emit('close')
    }
  },
  computed: {
    theme () {
      return this.$store.state.theme
    }
  },
  mounted () {
    document.body.addEventListener('keyup', e => {
      if (e.keyCode === 27) {
        this.close()
      }
    })
  }
}
</script>

<style lang="scss">
@import "@/style/_colors.scss";
.modal-mask[theme=legacy],
.modal-mask[theme=dark] {
  > .modal-wrapper {
    > .modal-container {
      box-shadow: none;

      .modal-default-button {
        background: rgba(255,255,255,.03);
        &:hover {
          background: rgba(255,255,255,.06);
        }
      }
    }
  }
}

.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  transition: opacity .3s ease;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--modal-mask);
    opacity: 0.5;
  }
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  align-items: center;
  padding: 32px;
}
.modal-container {
  position: relative;
  overflow: auto;
  width: 100%;
  max-height: 100%;
  max-width: 480px;
  margin: 0px auto;
  padding: 24px 32px;
  box-sizing: border-box;
  background-color: var(--modal-background);
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, .15);
  transition: all .3s ease;
}
.modal-header h3 {
  margin-top: 0;
  font-size: 1.5em;
  font-weight: 400;
  color: var(--primary-color);
  text-align: center;
}
.modal-body {
  margin: 16px 0;
}
.modal-exit-button {
  position: absolute;
  right: 0;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  transform: translate(50%, -50%);
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
  cursor: pointer;
  &:before, &:after {
    position: absolute;
    top: 8px;
    left: 15px;
    content: ' ';
    height: 16px;
    width: 2px;
    background-color: #999;
    transition: background-color .2s ease;
  }
  &:hover {
    &:before, &:after {
      background-color: #333;
    }
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
}
.modal-footer {
}
.modal-default-button {
  padding: 12px 24px;
  line-height: 1em;
  background: $background-light;
  font-size: .75em;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  color: var(--primary-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  transition: background .2s ease;

  &:hover {
    background: $background-lighter;
  }
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>