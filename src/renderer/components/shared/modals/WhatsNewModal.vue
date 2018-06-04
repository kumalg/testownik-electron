<template>
<Modal @close="$emit('close')">
  <div slot="body">
    <h2>Co nowego w wersji {{ appVersion }}?</h2>
    <ul v-if="whatsnew" class="whatsnew-ul">
      <li v-for="(paragraph, index) in whatsnew" :key="index">{{ paragraph }}</li>
    </ul>
    <div v-else>Przepraszamy, wystąpił problem</div>
  </div>
</Modal>
</template>

<script>
import { versions } from '@/changelog'
import Modal from '@/components/shared/Modal'
const appVersion = require('electron').remote.app.getVersion()

export default {
  components: {
    Modal
  },
  data () {
    return {
      appVersion,
      whatsnew: versions[appVersion]
    }
  }
}
</script>

<style lang="scss">
@import "@/style/_colors.scss";

h2 {
  margin-bottom: 16px;
}

.whatsnew-ul {
  padding-left: 24px;
  > li {
    font-size: 0.875em;
    margin: 6px 0;
  }
}
</style>
