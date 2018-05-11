<template>
<div>
  <div id="wrapper" :theme="$store.state.theme">
    <div class="last-locations">

    </div>
    <div class="right-column">
      <div class="right-column-content">
        <h1>Testownik</h1>
        <div class="buttons">
          <button @click="selectFolder">Wybierz folder</button>
          <button @click="sampleQuiz">Rozpocznij przykładowy quiz</button>

          <button @click="$emit('showSettings')">Ustawienia</button>
          <button @click="$emit('showInfo')">Informacje</button>
        </div>
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
const readdirAsync = promisify(fs.readdir)
const { dialog } = require('electron').remote
const openDialogAsync = options => new Promise(resolve => dialog.showOpenDialog(options, resolve))

export default {
  name: 'landing-page',
  components: { SystemInformation },
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
      const filenames = await readdirAsync(quizPath)
      const questions = await questionsReader.readFilesFromFolder(quizPath, filenames)
      const quiz = quizMaker.prepareQuizObject(questions)
      this.$router.push({ name: 'quiz', params: { quizObject: quiz } })
    },
    sampleQuiz () {
      this.$router.push({ name: 'quiz', params: { quizObject: JSON.parse(JSON.stringify(sampleQuiz)) } })
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
  .last-locations {
    background: $background-darkest;
  }
  .right-column {
    .right-column-content {
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

  .last-locations {
    width: 300px;
    background: $background-light;
    transition: background .2s ease;
  }

  .right-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 0 64px rgba(0,0,0,.05);

    .right-column-content {
      margin-top: 32px;
      overflow-y: auto;
      .buttons {
        margin-top: 32px;
        > button {
          margin: 8px auto;
          display: block;
          padding: 12px 24px;
          border: none;
          border-radius: 48px;
          cursor: pointer;
          background: none;
          transition: all .2s ease;
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
