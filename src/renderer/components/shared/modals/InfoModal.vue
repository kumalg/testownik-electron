<template>
<Modal @close="$emit('close')">
  <div slot="body">
    <h2>Testownik</h2>
    <!-- <p>Autor: <b><a href="http://www.kumalg.pl" target="_blank">Kamil Golec</a></b></p> -->
    <p>Autor: <b><a @click="openExternal('http://www.kumalg.pl')">Kamil Golec</a></b></p>
    <p>Adres E-Mail: <b><a href="mailto:kumalgfilms@gmail.com">kumalgfilms@gmail.com</a></b></p>
    <p>Wersja: <b>{{ appVersion }}</b></p>
    <h3>Co nowego w tej wersji?</h3>
    <ul v-if="whatsnew" class="whatsnew-ul">
      <li v-for="(paragraph, index) in whatsnew" :key="index">{{ paragraph }}</li>
    </ul>
  </div>
</Modal>
</template>

<script>
import { versions } from '@/changelog'
import { shell } from 'electron'
import Modal from '@/components/shared/Modal'
const appVersion = require('electron').remote.app.getVersion()
// const browserWindow = remote.getCurrentWindow()

export default {
  components: {
    Modal
  },
  data () {
    return {
      appVersion,
      whatsnew: versions[appVersion]
    }
  },
  methods: {
    openExternal (url) {
      shell.openExternal(url)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/_colors.scss";

h3 {
  margin-top: 32px;
}

a {
  text-decoration: none;
  color: inherit;
  transition: color .2s ease;
  cursor: pointer;
  &:hover {
    color: $primary-color;
  }
}

p {
  font-size: 0.875em;
  color: var(--secondary-text);
  b {
    color: var(--primary-text);
  }
}

b {
  font-weight: 600;
}

.whatsnew-ul {
  margin-top: 12px;
  padding-left: 24px;
  > li {
    font-size: 0.875em;
    margin: 6px 0;
  }
}
</style>
