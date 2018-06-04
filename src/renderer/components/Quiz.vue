<template>
<div>
  <div class="quiz-wrapper" :theme="theme">
    <SaveBeforeExit v-if="isSaveBeforeQuitQuizModalOpened" @quitQuiz="quitQuiz" @saveState="saveAndQuitQuiz" @close="isSaveBeforeQuitQuizModalOpened = false"/>
    <SaveBeforeExit v-if="isSaveBeforeQuitAppModalOpened" @quitQuiz="quitApp" @saveState="saveAndQuitApp" @close="isSaveBeforeQuitAppModalOpened = false"/>
    <FinishQuizModal v-if="showFinishModal" :time="quiz.time" @close="quitQuiz" />
    <SelectOptionsModal v-if="isSelectOptionsModalOpened" :select="selectOptionsModalContent" @selectOption="setSelectedOptionId" @close="isSelectOptionsModalOpened = false"/>
    <div class="question-wrapper">
      <transition name="answers-container-fade" mode="out-in">
        <div v-if="quiz && currentQuestion" :key="questionNum" :class="['question-wrapper-content', {'show-answers': !acceptVisible}]">
          <div v-if="currentQuestion.type == 'single'" class="single-question">
            <div class="single-question-content">
              <div class="question-content">
                <span v-if="currentQuestion.contentType == 'text'">{{ currentQuestion.content }}</span>
                <img v-else :src="'file:///' + quiz.location + '/' + currentQuestion.content">
              </div>
            </div>
            <div class="single-question-answers">
              <ul>
                <li v-for="(answer, index) in unsortedAnswers" :key="'answer_' + index" :class="[{'correct-answer': answer.isCorrect}, {'white-background': answer.type == 'image'}]">
                  <input type="checkbox" v-model="answers" :value="answer.id" :id="'answer_' + answer.id" :disabled="!acceptVisible">
                  <label :for="'answer_' + answer.id">
                    <span v-if="answer.type == 'text'">{{ answer.content }}</span>
                    <img v-else :src="'file:///' + quiz.location + '/' + answer.content" alt="rysunek">
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div v-else-if="currentQuestion.type == 'select'" class="select-question">
            <div class="select-question-content">
            <template v-for="(item, index) in selectQuestionContent">
              <span v-if="typeof item === 'string'" class="select-question-content-span" :key="index">{{ item }}</span>
              <span
                v-else
                :key="index"
                :class="['select-question-content-span select-question-content-option-span', {'empty-span': !item.visibleContent}, {'correct-answer': item.isCorrect}]" 
                @click="acceptVisible ? showSelectOptionsModal(item.selectId) : null"
              >{{ item.visibleContent }}</span>
            </template>
            </div>
          </div>
        </div>
      </transition>
      <transition name="question-info-fade" mode="out-in">
        <div v-if="currentQuestion" class="question-info" :key="questionNum">
          <div class="question-info-wrapper">
            <div>
              <span>{{ currentQuestion.tag }}</span>
            </div><div>
              <span>Ponowne wystąpienia: <b>{{ currentQuestionReoccurrences }}</b></span>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="quiz-info-wrapper">
      <button :class="['action-button', {'next': !acceptVisible, 'accept': acceptVisible}]" @click="actionButtonClick"/>
      <div class="quiz-info-wrapper-content">
        <div class="stats" v-if="quiz && currentQuestion">
          <div class="stat-item-container submitted-answers-container">
            <h3>Udzielone odpowiedzi</h3>
            <ProgressBar
              :progress="correctAnswersRatio"
              :backgroundColor="theme == 'dark' ? 'rgb(123, 30, 30)' : 'rgb(241, 81, 81)'"
            />
            <div class="progress-values">
              <span>{{ quiz.numberOfCorrectAnswers }}</span>
              <span class="pull-right">{{ quiz.numberOfBadAnswers }}</span>
            </div>
          </div>
          <div class="stat-item-container learned-questions-container">
            <h3>Opanowane pytania</h3>
            <ProgressBar
              :progress="learnedQuestionsRatio"
              :backgroundColor="theme != 'light' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'"
            />
            <div class="progress-values">
              <span>{{ quiz.numberOfLearnedQuestions }}</span>
              <span class="pull-right">{{ quiz.numberOfQuestions - quiz.numberOfLearnedQuestions }}</span>
            </div>
          </div>
          <div class="stat-item-container questions-number-container">
            <h3>Liczba pytań</h3>
            <h4>{{ quiz.numberOfQuestions }}</h4>
          </div>
          <div class="stat-item-container learning-time-container">
            <h3>Czas nauki</h3>
            <h4>{{ quiz.time | moment }}</h4>
          </div>
        </div>
        <div class="buttons">
          <button @click="tryQuitQuiz"><FontAwesomeIcon :icon="faPowerOff"/>
          </button><button v-if="quiz.location" @click="saveQuiz"><FontAwesomeIcon :icon="faSave"/>
          </button><button @click="$emit('showSettings')"><FontAwesomeIcon :icon="faCog"/>
          </button><button @click="$emit('showInfo')"><FontAwesomeIcon :icon="faInfo"/></button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import fs from 'fs'
import _ from 'lodash'
import moment from 'moment'
import { remote } from 'electron'
import ProgressBar from '@/components/Quiz/ProgressBar'
import FinishQuizModal from '@/components/Quiz/modals/FinishQuizModal'
import SelectOptionsModal from '@/components/Quiz/modals/SelectOptionsModal'
import SaveBeforeExit from '@/components/Quiz/modals/SaveBeforeExit'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faPowerOff, faCog, faInfo } from '@fortawesome/fontawesome-free-solid'
import { faSave } from '@fortawesome/fontawesome-free-regular'
const browserWindow = remote.getCurrentWindow()

var timer

export default {
  props: {
    quizObject: {
      type: Object
    }
  },
  components: {
    ProgressBar,
    FinishQuizModal,
    SelectOptionsModal,
    SaveBeforeExit,
    FontAwesomeIcon
  },
  data () {
    return {
      faPowerOff,
      faCog,
      faInfo,
      faSave,
      questionNum: 0,
      acceptVisible: true,
      currentQuestionTag: null,
      currentQuestion: null,
      unsortedAnswers: null,
      quiz: this.quizObject,
      showFinishModal: false,
      isSelectOptionsModalOpened: false,
      isSaveBeforeQuitQuizModalOpened: false,
      isSaveBeforeQuitAppModalOpened: false,
      answers: [],
      selectAnswers: [],
      selectObject: Object,
      selectOptionsModalContent: null
    }
  },
  methods: {
    tryQuitApp (event) {
      if (this.quiz.location) this.isSaveBeforeQuitAppModalOpened = true
      else this.quitApp()
    },
    tryQuitQuiz () {
      if (this.quiz.location) this.isSaveBeforeQuitQuizModalOpened = true
      else this.quitQuiz()
    },
    saveAndQuitQuiz () {
      this.saveQuiz()
      this.quitQuiz()
    },
    saveAndQuitApp () {
      this.saveQuiz()
      this.quitApp()
    },
    quitQuiz () {
      this.$router.push('/')
    },
    quitApp () {
      browserWindow.close()
    },
    saveQuiz () {
      const content = JSON.stringify(this.quiz, this.replacer)
      try {
        fs.writeFileSync(this.quiz.location + '/save.json', content, 'utf-8')
        alert('Zapisano aktualny stan!')
      } catch (e) {
        alert('Failed to save the file !')
      }
    },
    replacer (key, value) {
      if (key === 'questions') return undefined
      else return value
    },
    actionButtonClick () {
      if (this.acceptVisible) {
        this.checkUserAnswer()
      } else {
        this.questionNum++
        this.answers = []
        this.randomQuestion()
      }
      this.acceptVisible = !this.acceptVisible
    },
    randomItem (array) {
      return array[Math.floor(Math.random() * array.length)]
    },
    checkUserAnswer () {
      if (this.currentQuestionTag) {
        var questionReoccurrences = this.quiz.reoccurrences.find(r => r.tag === this.currentQuestionTag)

        var isCorrect
        if (this.currentQuestion.type === 'single') {
          const correctAnswers = this.currentQuestion.answers
            .filter(a => a.isCorrect)
            .map(a => a.id)
          isCorrect = correctAnswers.sort().join(',') === this.answers.sort().join(',')
        } else if (this.currentQuestion.type === 'select') {
          isCorrect = !this.selectAnswers.find(c => c.correctOptionId !== c.selectedOptionId)
        }

        if (isCorrect) {
          this.quiz.numberOfCorrectAnswers++
          questionReoccurrences.value--
          if (questionReoccurrences.value === 0) {
            this.quiz.numberOfLearnedQuestions++
          }
        } else {
          this.quiz.numberOfBadAnswers++
          questionReoccurrences.value += this.reoccurrencesIfBad
          if (questionReoccurrences.value > this.maxReoccurrences) {
            questionReoccurrences.value = this.maxReoccurrences
          }
        }
      }

      const remainingQuestionsReoccurrences = this.quiz.reoccurrences.filter(r => r.value > 0)
      if (!remainingQuestionsReoccurrences.length) {
        this.finishQuiz()
      }
    },
    randomQuestion () {
      this.unsortedAnswers = null
      this.selectAnswers = null
      this.currentQuestionTag = null
      this.currentQuestionTag = null
      const remainingQuestionsReoccurrences = this.quiz.reoccurrences.filter(r => r.value > 0)
      if (remainingQuestionsReoccurrences.length) {
        const questionTag = this.randomItem(remainingQuestionsReoccurrences).tag
        if (questionTag) {
          this.currentQuestionTag = questionTag
          this.currentQuestion = this.quiz.questions.find(q => q.tag === this.currentQuestionTag)
          if (this.currentQuestion.type === 'single') {
            this.unsortedAnswers = _.shuffle(this.currentQuestion.answers)
          } else if (this.currentQuestion.type === 'select') {
            this.selectAnswers = this.currentQuestion.answers.map(s => {
              return {
                selectId: s.id,
                selectedOptionId: null,
                correctOptionId: s.correctOptionId
              }
            })
            this.unsortedAnswers = JSON.parse(JSON.stringify(this.currentQuestion.content))
          }
        }
      } else {
        this.finishQuiz()
      }
    },
    finishQuiz () {
      this.stopTimer()
      this.showFinishModal = true
    },
    startTimer () {
      timer = window.setInterval(() => {
        this.quiz.time += 1000
      }, 1000)
    },
    stopTimer () {
      window.clearInterval(timer)
      timer = null
    },
    setSelectedOptionId (response) {
      const item = this.selectAnswers.find(i => i.selectId === response.selectId)
      if (item != null) {
        item.selectedOptionId = response.optionId
      }
    },
    showSelectOptionsModal (selectId) {
      this.isSelectOptionsModalOpened = true
      this.selectOptionsModalContent = this.currentQuestion.answers.find(s => s.id === selectId)
    },
    toggleAnswerSelect (index) {
      if (index >= 0 && index < this.unsortedAnswers.length) {
        const id = this.unsortedAnswers[index].id
        const answerIndex = this.answers.indexOf(id)

        if (answerIndex === -1) {
          this.answers.push(id)
        } else {
          this.answers.splice(answerIndex, 1)
        }
      }
    }
  },
  computed: {
    correctAnswersRatio () {
      return this.quiz.numberOfCorrectAnswers / (this.quiz.numberOfCorrectAnswers + this.quiz.numberOfBadAnswers)
    },
    learnedQuestionsRatio () {
      return this.quiz.numberOfLearnedQuestions / this.quiz.numberOfQuestions
    },
    currentQuestionReoccurrences () {
      if (!this.currentQuestionTag) {
        return null
      }
      return this.quiz.reoccurrences.find(r => r.tag === this.currentQuestionTag).value
    },
    theme () {
      return this.$store.state.theme
    },
    reoccurrencesIfBad () {
      return this.$store.state.reoccurrencesIfBad
    },
    maxReoccurrences () {
      return this.$store.state.maxReoccurrences
    },
    selectQuestionContent () {
      if (this.currentQuestion == null || this.currentQuestion.type !== 'select') {
        return null
      }
      const cont = this.unsortedAnswers.map(l => {
        if (typeof l !== 'string') {
          const selection = this.selectAnswers.find(i => i.selectId === l.selectId)
          if (selection.selectedOptionId != null) {
            const select = this.currentQuestion.answers.find(s => s.id === l.selectId)
            if (select != null) {
              const option = select.options.find(o => o.id === selection.selectedOptionId)
              l.visibleContent = option != null ? option.content : ''
              l.isCorrect = option.isCorrect
            }
          }
        }
        return l
      })
      return cont
    }
  },
  filters: {
    moment: function (date) {
      const duration = moment.duration(date, 'ms')
      return duration.hours().toFixed().padStart(2, '0') + ':' + duration.minutes().toFixed().padStart(2, '0') + ':' + duration.seconds().toFixed().padStart(2, '0')
    }
  },
  mounted () {
    if (!this.quizObject) {
      this.quitQuiz()
    }
    document.body.addEventListener('keyup', e => {
      if (e.keyCode === 32 && !this.showFinishModal) this.actionButtonClick()
      if (this.acceptVisible && !this.showFinishModal) {
        if (e.keyCode >= 49 && e.keyCode <= 57) this.toggleAnswerSelect(e.keyCode - 49)
        else if (e.keyCode >= 97 && e.keyCode <= 105) this.toggleAnswerSelect(e.keyCode - 97)
      }
    })
    this.randomQuestion()
    this.startTimer()
    window.onbeforeunload = (e) => {
      if (this.isSaveBeforeQuitAppModalOpened || !this.quiz.location) {
        e.resume()
      } else {
        this.isSaveBeforeQuitAppModalOpened = true
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/_colors.scss";

.question-content,
.question-info,
.answers-container {
  &-fade-enter-active,
  &-fade-leave-active {
    transition: all 0.2s ease;
  }
  &-fade-enter,
  &-fade-leave-to {
    opacity: 0;
  }
}

.question-content {
  &-fade-enter {
    transform: translateX(8px);
  }
  &-fade-leave-to {
    transform: translateX(-8px);
  }
}

.answers-container {
  &-fade-enter {
    transform: translateX(16px);
  }
  &-fade-leave-to {
    transform: translateX(-16px);
  }
}

.question-info {
  &-fade-enter {
    transform: translateX(32px);
  }
  &-fade-leave-to {
    transform: translateX(-32px);
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
  font-size: 16px;
}

.quiz-wrapper[theme=legacy] {
  .question-wrapper {
    .question-wrapper-content {
      .single-question {
        .single-question-content {
          background: #fff;
          span {
            color: #000 !important;
          }
        }
        .single-question-answers ul {
          flex-direction: column;
          align-items: center;
          > li {
            width: 100%;
            max-width: 640px;
            &:nth-child(odd) label{
              background: #dddddd;
            }
            label {
              span {
                color: #000 !important;
              }
            }
            > input[type="checkbox"]:checked ~ label {
              background: #ffff80;
              border-color: transparent;
              &::before {
                border-color: transparent;
              }
            }
          }
        }
      }
    }
  }
  .quiz-info-wrapper {
    .action-button {
      background: #f0f0f0;
      border: inset;
      border-radius: initial;
      &:after {
        border-color: #000;
      }
      &:hover {
        background: #f0f0f0;
      }
    }
  }
}

.quiz-wrapper[theme=light] {
  .question-wrapper {
    box-shadow: 0 0 64px rgba(0, 0, 0, 0.05);
    .question-wrapper-content {
      .single-question .single-question-answers ul {
        > li label {
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
        }
      }
      
      &.show-answers {
        .single-question .single-question-answers ul {
          > li {
            &.correct-answer {
              > input[type="checkbox"]:checked ~ label {
                box-shadow: 0 4px 32px rgba($green-color, 0.25);
              }
              > input[type="checkbox"]:not(:checked) ~ label {
                box-shadow: 0 4px 32px rgba($yellow-color, 0.25);
              }
            }
            &:not(.correct-answer) {
              > input[type="checkbox"]:checked ~ label {
                box-shadow: 0 4px 32px rgba($red-color, 0.25);
              }
            }
          }
        }
      }
    }
    .question-info {
      > .question-info-wrapper {
        > div {
          > span {
            box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
  .quiz-info-wrapper {
    .action-button {
      box-shadow: 0 4px 32px rgba($primary-color, 0.5);
    }
  }
}

$quiz-info-wrapper-width: 300px;
.quiz-wrapper {
  height: 100vh;
  display: flex;
  align-items: stretch;
  transition: color 0.2s ease;
  background: var(--main-window-background);

  .question-wrapper {
    height: 100%;
    padding-top: 32px;
    flex: 1;
    overflow: hidden;
    background: var(--main-window-background);
    z-index: 1;
    transition: background 0.2s ease;
    max-width: calc(100% - #{$quiz-info-wrapper-width});

    .question-info {
      position: fixed;
      z-index: 1;
      bottom: 16px;
      left: calc(50% - #{$quiz-info-wrapper-width * 0.5});
      .question-info-wrapper {
        transform: translateX(-50%);
        * {
          display: inline-block;
          span {
            display: inline-block;
            background: var(--background-3);
            padding: 8px 16px;
            font-size: 0.8125em;
            border-radius: 32px;
            margin: 4px;
            transition: all 0.2s ease;

            b {
              color: var(--primary-color);
            }
          }
        }
      }
    }

    .question-wrapper-content {
      height: 100%;
      flex: 1;
      position: relative;
      text-align: center;
      transition: all 0.2s ease;

      .select-question {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px 64px;
        overflow: auto;

        .select-question-content {
          .select-question-content-span {
            vertical-align: middle;
            line-height: 2em;
            margin: 2px 0;

            &.select-question-content-option-span {
              display: inline;
              min-height: 2em;
              min-width: 128px;
              padding: 4px 8px;
              font-weight: 600;
              border-bottom: 2px solid var(--secondary-text);
              transition: all 0.2s ease;

              &.empty-span {
                display: inline-block;
              }
            }
          }
        }
      }

      .single-question {
        height: 100%;
        display: flex;
        flex-direction: column;

        .single-question-content {
          width: 100%;
          max-height: 50%;
          overflow: auto;
          min-height: 64px;
          text-align: center;
          font-size: 0.875em;
          .question-content {
            margin: 16px 32px;
            img {
              background: $background-lighter;
            }
          }
        }

        .single-question-answers {
          padding: 16px 32px 64px;
          overflow: auto;
          flex: 1;
        }

        .single-question-answers ul {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;

          > li {
            width: calc(50% - 16px);
            margin: 8px;
            font-size: 0.875em;
            box-sizing: border-box;
            transition: background 0.2s ease;

            @media (max-width: 960px) {
              width: 100%;
            }

            label {
              position: relative;
              width: 100%;
              height: 100%;
              min-height: 64px;
              padding: 8px 16px;
              background: var(--answer-single-type-background);
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              transition: all 0.2s ease;
              cursor: pointer;

              border: {
                style: solid;
                color: transparent;
                width: 2px;
              }

              img {
                background: #fff;
                max-width: 100%;
              }

              &:before {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                border-width: 12px;
                border-style: solid;
                border-color: transparent;
                transition: border-color 0.2s ease;
              }

              &:after {
                content: "";
                position: absolute;
                top: 0;
                right: 4px;
                width: 4px;
                height: 8px;
                transform: rotate(45deg);
                transition: border-color 0.2s ease;
                border: {
                  style: solid;
                  color: transparent;
                  width: 0 2px 2px 0;
                }
              }
            }

            > input[type="checkbox"] {
              display: none;

              &:checked ~ label {
                border-color: var(--answer-single-type-checked-border-color);

                &::before {
                  border-color: var(--answer-single-type-checked-border-color) var(--answer-single-type-checked-border-color) transparent transparent;
                }
                &::after {
                  border-color: var(--answer-single-type-background);
                }
              }

              &:not(:disabled) ~ label {
                &:hover {
                  transform: scale(0.98);
                }
                &:active {
                  transform: scale(0.96);
                }
              }
            }
          }
        }
      }

      &:not(.show-answers) {
        .select-question-content {
          .select-question-content-span {
            &.select-question-content-option-span {
              cursor: pointer;
              &:hover {
                background: rgba(0, 0, 0, 0.05);
              }
            }
          }
        }
      }

      &.show-answers {
        .select-question {
          .select-question-content {
            .select-question-content-span {
              &.select-question-content-option-span {
                &.correct-answer {
                  background: rgba($green-color, 0.1);
                  border-bottom-color: var(--green-color);
                }
                &:not(.correct-answer) {
                  background: rgba($red-color, 0.1);
                  border-bottom-color: var(--red-color);
                }   
              }
            }
          }
        }
        .single-question .single-question-answers ul {
          > li {
            label {
              cursor: initial;
            }
            &.correct-answer {
              > input[type="checkbox"]:checked ~ label {
                border-color: var(--green-color);
                &::before {
                  border-color: var(--green-color) var(--green-color) transparent transparent;
                }
              }
              > input[type="checkbox"]:not(:checked) ~ label {
                border-color: var(--yellow-color);
              }
            }
            &:not(.correct-answer) {
              > input[type="checkbox"]:checked ~ label {
                border-color: var(--red-color);
                &::before {
                  border-color: var(--red-color) var(--red-color) transparent transparent;
                }
              }
            }
          }
        }
      }
    }
  }

  .quiz-info-wrapper {
    width: $quiz-info-wrapper-width;
    margin-left: auto;
    background: var(--sidebar-background);
    position: relative;
    text-align: center;
    transition: background 0.2s ease;

    .quiz-info-wrapper-content {
      margin-top: 32px;
      overflow-y: auto;
      width: 100%;
      height: calc(100% - 32px);
      display: flex;
      flex-direction: column;
    }

    .stats {
      margin: auto 0 0 0;
    }

    .stat-item-container {
      margin: 16px 0;

      h3 {
        font-size: 0.8125em;
        font-weight: 600;
      }

      h4 {
        font-weight: 400;
        font-size: 1.75em;
        color: var(--primary-color);
      }

      .progress-values {
        margin: auto;
        width: 150px;
        display: flex;
        font-size: 0.75em;
        .pull-right {
          margin-left: auto;
        }
      }
    }

    .buttons {
      margin-top: auto;
      margin-bottom: 60px;

      button {
        margin: 4px;
        height: 32px;
        width: 32px;
        border-radius: 16px;
        border: none;
        cursor: pointer;
        background: transparent;
        color: var(--secondary-text);
        transition: all 0.2s ease;
        &:hover {
          color: var(--primary-color);
          background: var(--main-window-background);
        }
      }
    }

    .action-button {
      position: absolute;
      background: var(--primary-color);
      color: #fff;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      bottom: 48px;
      left: -32px;
      z-index: 2;
      outline: none;
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease;

      &:hover {
        transform: scale(0.95);
        background: var(--primary-color-lighter);
      }

      &:active {
        transform: scale(0.9);
        background: var(--primary-color-lightest);
      }

      &::after {
        transition: all 0.2s ease;
      }

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        border: {
          style: solid;
          color: #fff;
          width: 0 2px 2px 0;
        }
      }

      &.accept::after {
        width: 8px;
        height: 16px;
        transform: translate(-50%, -65%) rotate(45deg);
      }

      &.next::after {
        width: 12px;
        height: 12px;
        transform: translate(-70%, -50%) rotate(-45deg);
      }
    }
  }
}
</style>
