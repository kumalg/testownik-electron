<template>
  <transition name="modal">
    <div class="modal-mask" @mousedown.stop="$emit('close')" @touchstart.stop="$emit('close')" :theme="theme">
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
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  computed: {
    theme () {
      return this.$store.state.theme
    }
  }
}
</script>

<style lang="scss">
@import "../style/_colors.scss";
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($background-dark, .5);
  display: table;
  transition: opacity .3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  padding: 24px;
}
.modal-container {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 0px auto;
  padding: 24px 32px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, .15);
  transition: all .3s ease;
  // font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
  margin-top: 0;
  font-size: 1.75em;
  color: $primary-color;
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
.modal-default-button {
  // float: right;
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