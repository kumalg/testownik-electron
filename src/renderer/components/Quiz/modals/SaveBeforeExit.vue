<template>
<Modal @close="$emit('close')">
  <div slot="body">
    <div class="body-content">
      <h3>Zapisać aktualny stan?</h3>
      <button @click="$emit('saveState')">Zapisz</button>
      <button @click="$emit('quitQuiz')">Wyjdź</button>
    </div>
  </div>
  <template slot="modal-footer-button">Anuluj</template>
</Modal>
</template>

<script>
import moment from 'moment'
import Modal from '@/components/shared/Modal'
export default {
  props: {
    time: {
      type: Number
    }
  },
  components: {
    Modal
  },
  filters: {
    moment: function (date) {
      const duration = moment.duration(date, 'ms')
      return duration.hours().toFixed().padStart(2, '0') + ':' + duration.minutes().toFixed().padStart(2, '0') + ':' + duration.seconds().toFixed().padStart(2, '0')
    }
  }
}
</script>

<style lang="scss">
@import "@/style/_colors.scss";

.body-content {
  display: flex;
  align-items: center;
  padding: 0 32px;
  .beer-image {
    height: 256px;
  }
  .info {
    margin-left: 32px;
  }
}
</style>
