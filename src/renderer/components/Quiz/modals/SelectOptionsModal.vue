<template>
<Modal @close="$emit('close')">
  <div slot="body">
    <div v-if="select" class="body-content">
      <ul class="options-list">
        <li v-for="option in select.options" :key="option.id" @click="selectOption(option.id)">{{ option.content }}</li>
      </ul>
    </div>
  </div>
</Modal>
</template>

<script>
import Modal from '@/components/shared/Modal'
export default {
  props: {
    select: {
      type: Object
    }
  },
  components: {
    Modal
  },
  methods: {
    selectOption (optionId) {
      this.$emit('selectOption', { selectId: this.select.id, optionId: optionId })
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.body-content {
  ul.options-list {
    list-style: none;
    padding: 0;
    > li {
      border-radius: 4px;
      padding: 8px 16px;
      margin: 8px 0;
      transition: background .2s ease;
      cursor: pointer;
      &:hover {
        background: rgba(0,0,0,.05);
      }
    }
  }
}

</style>
