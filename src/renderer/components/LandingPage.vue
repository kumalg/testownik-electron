<template>
<div>
  <div id="wrapper" :theme="$store.state.theme">
    <div class="left-column">
      <div class="left-column-content">
        <h1>Testownik</h1>
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
          <!-- <button @click="sampleQuiz">Rozpocznij przykładowy quiz</button> -->

          <button @click="$emit('showInfo')">
            <i>
              <FontAwesomeIcon :icon="faInfo"/>
            </i>
            Informacje
          </button><button @click="$emit('showSettings')">
            <i>
              <FontAwesomeIcon :icon="faCog"/>
            </i>
            Ustawienia
          </button>
        </div>
      </div>
    </div>
    <div class="last-locations" v-if="lastFolders && lastFolders.length > 0">
      <div class="last-locations-container">
        <h3>Ostatnio używane</h3>
        <ul>
          <li v-for="folder in lastFolders" :key="folder">
            <i @click="$store.dispatch('deleteLastFolder', folder)">
              <FontAwesomeIcon :icon="faTrashAlt"/>
            </i>
            <p @click="openQuiz(folder)">{{ folder }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SystemInformation from './LandingPage/SystemInformation'
import questionsReader from '@/services/questionsReader'
import quizMaker from '@/services/quizMaker'
import { sampleQuiz } from '@/sampleQuiz'
import fs from 'fs'
import { promisify } from 'util'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faCog, faInfo } from '@fortawesome/fontawesome-free-solid'
import { faTrashAlt } from '@fortawesome/fontawesome-free-regular'
const readdirAsync = promisify(fs.readdir)
const { dialog } = require('electron').remote
const openDialogAsync = options => new Promise(resolve => dialog.showOpenDialog(options, resolve))

export default {
  name: 'landing-page',
  components: {
    SystemInformation,
    FontAwesomeIcon
  },
  data () {
    return {
      faCog,
      faInfo,
      faTrashAlt,
      isDragOver: false
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
      const quiz = quizMaker.prepareQuizObject(questions)
      this.$router.push({ name: 'quiz', params: { quizObject: quiz } })
      this.$store.dispatch('addNewLastFolder', quizPath)
    },
    sampleQuiz () {
      this.$router.push({ name: 'quiz', params: { quizObject: JSON.parse(JSON.stringify(sampleQuiz)) } })
    }
  },
  computed: {
    lastFolders () {
      return this.$store.state.lastFolders
    }
  },
  mounted () {
    document.body.addEventListener('keyup', e => {
      if (e.keyCode === 84 && !this.showFinishModal) {
        this.sampleQuiz()
      }
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
@import '../style/_colors.scss';

h1 {
  font-size: 3em;
  font-weight: 200;
}

#wrapper[theme=dark] {
  background: $background-dark;
  color: $primary-text-ondark;
  
  #drag {
    border: 2px dashed rgba(255,255,255,.1);
    background: rgba(255,255,255,.02);
    color: rgba(255,255,255,.4);
    svg {
      height: 64px;
      margin-bottom: 16px;
      fill: rgba(255,255,255,.2);
    }
    &.drag-over {
      background: rgba(255,255,255,.04);
    }
  }
  .last-locations {
    background: $background-darkest;
    .last-locations-container {
      h3 {
        color: $secondary-text-ondark;
      }
      ul {
        li {
          &:hover {
            background: rgba(0,0,0,.25);
          }
          p {
            color: $primary-text-ondark;
          }
          i {
            color: $secondary-text-ondark;
          }
        }
      }
    }
  }
  .left-column {
    .left-column-content {
      .buttons > button {
        &:not(:hover) {
          color: $secondary-text-ondark;
        }
        &:hover {
          color: $primary-text-ondark;
          background: $background-darkest;
        }
      }
    }
  }
}

#wrapper {
  display: flex;
  background: $background-lighter;
  height: 100vh;
  width: 100vw;
  transition: background .2s ease;
  text-align: center;
  #drag {
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 2px dashed rgba(0,0,0,.1);
    background: rgba(0, 0, 0, 0.02);
    color:rgba(0,0,0,.5);
    text-align: center;
    max-width: 512px;
    height: 196px;
    margin: 32px auto;
    transition: background .2s ease;
    &.drag-over {
      background: rgba(0, 0, 0, 0.05);
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
      fill: rgba(0,0,0,.2);
      transition: all .2s ease;
    }

    a {
      height: 2em;
      overflow: hidden;
      cursor: pointer;
      transition: all .2s ease;
      &:hover {
        b {
          color: $primary-color;
        }
      }
    }

    button {
      margin: 8px;
      padding: 16px 32px;
      line-height: 1em;
      border-radius: 4px;
      background: $primary-color;
      color: #fff;
      font-family: 'Open Sans';
      font-weight: 600;
      font-size: 0.75em;
      border: none;
      cursor: pointer;
      transition: background .2s ease;
      &:hover {
        background: $primary-color-lighter;
      }
      &:active {
        background: $primary-color-lightest;
      }
    }
  }

  .last-locations {
    width: 300px;
    background: $background-light;
    transition: background .2s ease;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .last-locations-container {
      margin-top: 48px;
      h3 {
        text-align: right;
        margin-bottom: 24px;
        margin-right: 24px;
        color: $secondary-text;
        font-weight: 400;
      }

      ul {
        width: 100%;
        list-style: none;
        padding: 0;
        li {
          padding: 16px 24px;
          display: flex;
          flex-wrap: nowrap;
          cursor: pointer;
          transition: background .2s ease;
          font-size: 0.875em;
          &:hover {
            background: rgba(255,255,255,.25);
            i {
              opacity: 1;
            }
          }
          p {
            flex: 1;
            text-align: right;
            overflow: hidden;
            direction: rtl;
            text-overflow: ellipsis;
            color: $primary-text;
          }
          i {
            padding: 8px;
            margin: -8px;
            margin-right: 0;
            transition: color .2s ease, opacity .2s ease;
            color: $secondary-text;
            opacity: 0;
            &:hover {
              color: $red-color;
            }
          }
        }
      }
    }
  }

  .left-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 0 64px rgba(0,0,0,.05);

    .left-column-content {
      margin-top: 32px;
      padding: 32px;
      overflow-y: auto;
      .buttons {
        // margin: 32px;
        > button {
          margin: 8px;
          // display: block;
          padding: 12px 24px;
          border: none;
          border-radius: 48px;
          cursor: pointer;
          background: none;
          transition: all .2s ease;
          i {
            opacity: .4;
            margin-right: 16px;
          }
          &:not(:hover) {
            color: rgba(0,0,0,.75);
          }
          &:hover {
            background: $background-light;
          }
        }
      }
    }
  }
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div { flex-basis: 50%; }

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
