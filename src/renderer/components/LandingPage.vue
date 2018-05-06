<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <button @click="selectFolder">Wybierz folder</button>
    <!-- <router-link :to="{ name: 'quiz', params: { quizObject: quiz }}">
      Rozpocznij quiz
    </router-link> -->
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import questionsReader from '@/services/questionsReader'
  import quizMaker from '@/services/quizMaker'
  const fs = require('fs')
  const { dialog } = require('electron').remote

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data () {
      return {}
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      selectFolder () {
        dialog.showOpenDialog({properties: ['openDirectory']}, (path) => {
          if (path == null || path.length === 0 || path[0] == null) {
            throw new Error('Błąd przy wyborze folderu')
          }
          const quizPath = path[0]
          fs.readdir(quizPath, (err, files) => {
            if (err) {
              throw new Error(err)
            }
            const questions = questionsReader.readFilesFromFolder(quizPath, files)
            const quiz = quizMaker.prepareQuizObject(questions)
            this.$router.push({ name: 'quiz', params: { quizObject: quiz } })
          })
        })
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Open Sans', sans-serif; 
    overflow-y: hidden;
  }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
    overflow-y: auto;
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
