<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <router-link :to="{ name: 'quiz', params: { quizObject: quiz }}">
      Rozpocznij quiz
    </router-link>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data () {
      return {
        quiz: {
          numberOfQuestions: 3,
          time: 0,
          reoccurrences: [
            { tag: '001.txt', value: 2 },
            { tag: '002.txt', value: 2 },
            { tag: '003.txt', value: 2 }
          ],
          questions: [{
            tag: '001.txt',
            contentType: 'text',
            content: 'Czy pytania będa łatwe?',
            type: 'single',
            answers: [{
              type: 'text',
              content: 'Tak',
              isCorrect: true
            }, {
              type: 'text',
              content: 'No tak średnio bym powiedział',
              isCorrect: false
            }, {
              type: 'text',
              content: 'Nie wiem, choć się domyślam',
              isCorrect: true
            }, {
              type: 'text',
              content: 'Wiem, ale nie powiem',
              isCorrect: false
            }]
          }, {
            tag: '002.txt',
            contentType: 'text',
            content: 'Więcej niż jedno zwierze to:',
            type: 'single',
            answers: [{
              type: 'text',
              content: 'Owca',
              isCorrect: false
            }, {
              type: 'text',
              content: 'Stado',
              isCorrect: true
            }, {
              type: 'text',
              content: 'Lama',
              isCorrect: false
            }]
          }, {
            tag: '003.txt',
            contentType: 'text',
            content: 'Czy vue.js to cudowny framework?',
            type: 'single',
            answers: [{
              type: 'text',
              content: 'Tak',
              isCorrect: true
            }, {
              type: 'text',
              content: 'Nie',
              isCorrect: false
            }]
          }]
        }
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
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
