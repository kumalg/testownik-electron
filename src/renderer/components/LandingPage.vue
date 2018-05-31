<template>
<div>
  <ContinueQuizModal v-if="isContinueQuizModalOpen" ref="continueQuizModal" @close="isContinueQuizModalOpen = false"/>
  <div id="wrapper">
    <div class="left-column">
      <div class="left-column-content">
        <h1>Testownik</h1>
        <div v-if="newVersionAvailable" class="new-version-message">
          <p>Dostępna nowa wersja!</p>
          <a class="close-and-install" @click="$electron.ipcRenderer.send('quitAndInstall')">Odśwież</a>
        </div>
        <div id="drag" :class="{'drag-over': isDragOver}">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 412 412" style="enable-background:new 0 0 412 412;" xml:space="preserve">
              <path d="M334,140h-64c-4.4,0-8,3.6-8,8c0,4.4,3.6,8,8,8h64c13.2,0,24,10.8,24,24v192c0,13.2-10.8,24-24,24H78
                c-13.2,0-24-10.8-24-24V180c0-13.2,10.8-24,24-24h72c4.4,0,8-3.6,8-8c0-4.4-3.6-8-8-8H78c-22,0-40,18-40,40v192c0,22,18,40,40,40
                h256c22,0,40-18,40-40V180C374,158,356,140,334,140z"/>
              <path d="M206,28c4.4,0,8-3.6,8-8V8c0-4.4-3.6-8-8-8c-4.4,0-8,3.6-8,8v12C198,24.4,201.6,28,206,28z"/>
              <path d="M129.6,211.6c-3.2,3.2-3.2,8,0,11.2l70.8,70.8c1.6,1.6,3.6,2.4,5.6,2.4s4-0.8,5.6-2.4l70.8-70.8c3.2-3.2,3.2-8,0-11.2
                s-8-3.2-11.2,0L214,268.8V56c0-4.4-3.6-8-8-8c-4.4,0-8,3.6-8,8v212.8l-57.2-57.2C137.6,208.4,132.8,208.4,129.6,211.6z"/>
            </svg>
            <a @click="selectFolder"><b>Wybierz folder</b> lub upuść go tutaj</a>
          </div>
        <div class="buttons">
          <button class="default-button" @click="$emit('showInfo')">
            <i>
              <FontAwesomeIcon :icon="faInfo"/>
            </i>
            Informacje
          </button><button class="default-button" @click="$emit('showSettings')">
            <i>
              <FontAwesomeIcon :icon="faCog"/>
            </i>
            Ustawienia
          </button>
        </div>
      </div>
    </div>
    <RecentFolders v-if="recentFolders && recentFolders.length > 0" :recentFolders="recentFolders" @FolderClick="openQuiz" />
  </div>
</div>
</template>

<script>
import RecentFolders from '@/components/LandingPage/RecentFolders'
import ContinueQuizModal from '@/components/LandingPage/modals/ContinueQuizModal'
import questionsReader from '@/services/questionsReader'
import quizMaker from '@/services/quizMaker'
import { sampleQuiz } from '@/sampleQuiz'
import fs from 'fs'
import { promisify } from 'util'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faCog, faInfo } from '@fortawesome/fontawesome-free-solid'
const readdirAsync = promisify(fs.readdir)
const { dialog } = require('electron').remote
const openDialogAsync = options => new Promise(resolve => dialog.showOpenDialog(options, resolve))

export default {
  name: 'landing-page',
  components: {
    RecentFolders,
    FontAwesomeIcon,
    ContinueQuizModal
  },
  data () {
    return {
      faCog,
      faInfo,
      isDragOver: false,
      isContinueQuizModalOpen: false,
      newVersionAvailable: false
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    async selectFolder () {
      const path = await openDialogAsync({ properties: ['openDirectory'] })
      if (path == null || path.length === 0 || path[0] == null) {
        throw new Error('Błąd przy wyborze folderu')
      }
      const quizPath = path[0]
      await this.openQuiz(quizPath)
    },
    async openQuiz (quizPath) {
      const filenames = await readdirAsync(quizPath)
      const questions = await questionsReader.readFilesFromFolder(quizPath, filenames)
      if (filenames.find(f => f === 'save.json')) {
        this.isContinueQuizModalOpen = true
        this.$nextTick(() => {
          const continueQuizModal = this.$refs.continueQuizModal
          continueQuizModal.$on('new', () => this.openNewQuiz(questions, quizPath))
          continueQuizModal.$on('continue', () => this.openContinuedQuiz(questions, quizPath))
        })
      } else this.openNewQuiz(questions, quizPath)
    },
    openNewQuiz (questions, quizPath) {
      const quiz = quizMaker.prepareQuizObject(questions, quizPath)
      this.goToQuiz(quiz, quizPath)
    },
    async openContinuedQuiz (questions, quizPath) {
      const quiz = await quizMaker.prepareQuizObjectWithSave(questions, quizPath)
      this.goToQuiz(quiz, quizPath)
    },
    goToQuiz (quiz, quizPath) {
      this.$router.push({ name: 'quiz', params: { quizObject: quiz } })
      this.$store.dispatch('deleteRecentFolder', quizPath)
      this.$store.dispatch('addNewRecentFolder', quizPath)
    },
    sampleQuiz () {
      this.$router.push({ name: 'quiz', params: { quizObject: JSON.parse(JSON.stringify(sampleQuiz)) } })
    }
  },
  computed: {
    recentFolders () {
      return this.$store.state.recentFolders
    }
  },
  mounted () {
    document.body.addEventListener('keyup', e => {
      if (e.keyCode === 84 && !this.showFinishModal) {
        this.sampleQuiz()
      }
    })
    this.$electron.ipcRenderer.on('updateReady', () => {
      this.newVersionAvailable = true
    })
    var holder = document.getElementById('drag')
    holder.ondragover = (e) => {
      e.preventDefault()
      this.isDragOver = true
      return false
    }
    holder.ondragenter = (e) => {
      e.preventDefault()
      this.isDragOver = true
      return false
    }
    holder.ondragleave = (e) => {
      e.preventDefault()
      this.isDragOver = false
      return false
    }
    holder.ondragend = (e) => {
      e.preventDefault()
      this.isDragOver = false
      return false
    }
    holder.ondrop = (e) => {
      e.preventDefault()
      if (e.dataTransfer.files.length > 0) {
        this.openQuiz(e.dataTransfer.files[0].path)
      }
      this.isDragOver = false
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/_colors.scss';

h1 {
  font-size: 3em;
  font-weight: 200;
}

#wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  transition: background .2s ease;
  text-align: center;
  background: var(--main-window-background);

  #drag {
    border-color: var(--drag-border-color);
    background: var(--drag-background);
    color: var(--secondary-text);
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border-width: 2px;
    border-style: dashed;
    text-align: center;
    max-width: 512px;
    height: 196px;
    margin: 32px auto;
    transition: background .2s ease;
    &.drag-over {
      background: var(--drag-over-background);
      a {
        height: 0;
      }
      svg {
        height: 96px;
      }
    }

    p {
      font-size: .875em;
      margin: 8px;
    }

    b {
      font-weight: 600;
      transition: color .2s ease;
    }

    svg {
      height: 64px;
      margin-bottom: 16px;
      fill: var(--distant-text);
      transition: all .2s ease;
    }

    a {
      height: 2em;
      overflow: hidden;
      cursor: pointer;
      transition: all .2s ease;
      &:hover {
        b {
          color: var(--primary-color);
        }
      }
    }

    button {
      margin: 8px;
      padding: 16px 32px;
      line-height: 1em;
      border-radius: 4px;
      background: var(--primary-color);
      color: #fff;
      font-family: 'Open Sans';
      font-weight: 600;
      font-size: 0.75em;
      border: none;
      cursor: pointer;
      transition: background .2s ease;
      &:hover {
        background: var(--primary-color-lighter);
      }
      &:active {
        background: var(--primary-color-lightest);
      }
    }
  }

  .left-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 0 64px rgba(0,0,0,.05);
    z-index: 1;

    .left-column-content {
      margin-top: 32px;
      padding: 32px;
      overflow-y: auto;
      .buttons {
        > button {
          margin: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 48px;
          cursor: pointer;
          background: none;
          transition: all .2s ease;
          color: var(--secondary-text);
          i {
            opacity: .4;
            margin-right: 16px;
          }
          &:hover {
            color: var(--primary-text);
            background: var(--sidebar-background);
          }
        }
      }
    }
  }
}
</style>
