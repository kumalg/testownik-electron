<template>
<div>
  <div class="quiz-wrapper" :theme="theme">
    <FinishQuizModal v-if="showFinishModal" :time="quiz.time" @close="quitQuiz" />
    <SelectOptionsModal v-if="isSelectOptionsModalOpened" :select="selectOptionsModalContent" @selectOption="setSelectedOptionId" @close="isSelectOptionsModalOpened = false"/>
    <!-- <SettingsModal v-if="showSettingsModal" @close="showSettingsModal = false"/> -->
    <div class="question-wrapper">
      <div v-if="quiz && currentQuestion" class="question-content-wrapper">
        <div class="question-content" v-if="currentQuestion.type === 'single'">
          <transition name="question-content-fade" mode="out-in">
            <div :key="questionNum">
              <span v-if="currentQuestion.contentType == 'text'">{{ currentQuestion.content }}</span>
              <img v-else :src="'file:///' + currentQuestion.content">
            </div>
          </transition>
        </div>
      </div>
      <div v-if="quiz && currentQuestion" :class="['answer-wrapper', {'show-answers': !acceptVisible}]">
        <transition name="answers-container-fade" mode="out-in">
          <div v-if="currentQuestion" :key="questionNum">
            <template v-if="currentQuestion.type == 'single'">
              <ul class="single-question">
                <li v-for="(answer, index) in unsortedAnswers" :key="'answer_' + index" :class="[{'correct-answer': answer.isCorrect}, {'white-background': answer.type == 'image'}]">
                  <input type="checkbox" v-model="answers" :value="answer.id" :id="'answer_' + answer.id" :disabled="!acceptVisible">
                  <label :for="'answer_' + answer.id">
                    <span v-if="answer.type == 'text'">{{ answer.content }}</span>
                    <img v-else :src="'file:///' + answer.content">
                  </label>
                </li>
              </ul>
            </template>
            <div v-else-if="currentQuestion.type == 'select'" class="select-question-content">
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
        </transition>
        <transition name="question-info-fade" mode="out-in">
          <div class="question-info" :key="questionNum">
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
              :backgroundColor="theme == 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'"
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
          <button @click="quitQuiz"><FontAwesomeIcon :icon="faSignOutAlt"/>
          </button><button @click="$emit('showSettings')"><FontAwesomeIcon :icon="faCog"/>
          </button><button @click="$emit('showInfo')"><FontAwesomeIcon :icon="faInfo"/></button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import ProgressBar from './ProgressBar'
import FinishQuizModal from './FinishQuizModal'
import SelectOptionsModal from '@/components/Quiz/SelectOptionsModal'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faSignOutAlt, faCog, faInfo } from '@fortawesome/fontawesome-free-solid'

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
    FontAwesomeIcon
  },
  data () {
    return {
      faSignOutAlt,
      faCog,
      faInfo,
      questionNum: 0,
      acceptVisible: true,
      currentQuestionTag: null,
      currentQuestion: null,
      unsortedAnswers: null,
      quiz: this.quizObject,
      showFinishModal: false,
      isSelectOptionsModalOpened: false,
      answers: [],
      selectAnswers: [],
      selectObject: Object,
      selectOptionsModalContent: null
    }
  },
  methods: {
    quitQuiz () {
      this.$router.push('/')
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
          console.log(this.selectAnswers)
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
      console.log('setSelectedOptionId')
      const item = this.selectAnswers.find(i => i.selectId === response.selectId)
      if (item != null) {
        item.selectedOptionId = response.optionId
      }
    },
    showSelectOptionsModal (selectId) {
      this.isSelectOptionsModalOpened = true
      this.selectOptionsModalContent = this.currentQuestion.answers.find(s => s.id === selectId)
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
      console.log(cont)
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
      if (e.keyCode === 32 && !this.showFinishModal) {
        this.actionButtonClick()
      }
      if (this.acceptVisible && !this.showFinishModal && e.keyCode >= 49 && e.keyCode <= 57) {
        const index = e.keyCode - 49
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
    })
    this.randomQuestion()
    this.startTimer()
  }
}
</script>

<style lang="scss" scoped>
@import '../style/_colors.scss';

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
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
}

.quiz-wrapper[theme=dark] {
  color: $primary-text-ondark;
  .question-wrapper {
    background: $background-dark;
    box-shadow: none;
    .answer-wrapper {
      &:not(.show-answers) {
        .select-question-content {
          .select-question-content-span {
            &.select-question-content-option-span {
              border-bottom-color: $secondary-text-ondark;
            }
          }
        }
      }
      ul.single-question {
        > li label {
          box-shadow: none !important;
        }
        > li:not(.white-background) {
          $checked-color: rgba(255,255,255,.15);
          label {
            background: $background-darker;
            color: $primary-text-ondark;
          }
          > input[type=checkbox]:checked ~ label {
            border-color: $checked-color;
            &::before {
              border-color: $checked-color $checked-color transparent transparent;
            }
            &::after {
              border-color: $background-darker;
            }
          }
        }
      }
      .question-info {
        > .question-info-wrapper {
          > div {
            > span {
              background: $background-darker;
              box-shadow: none;
            }
          }
        }
      }
    }
  }
  .quiz-info-wrapper {
    background: $background-darkest;
    .buttons {
      button {
        color: $secondary-text-ondark;
        &:hover {
          background: $background-dark;
        }
      }
    }
    .action-button {
      box-shadow: none;
    }
  }
}

$quiz-info-wrapper-width: 300px;
.quiz-wrapper {
  height: 100vh;
  display: flex;
  align-items: stretch;
  transition: color .2s ease;
  color: rgba(0,0,0,.85);

  .question-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fafafa;
    z-index: 1;
    box-shadow: 0 0 64px rgba(0,0,0,.05);
    transition: background .2s ease;
    max-width: calc(100% - #{$quiz-info-wrapper-width});

    .question-content-wrapper {
      margin-top: 40px;
      min-height: 64px;
      text-align: center;
      font-size: 0.875em;
      display: flex;
      align-items: center;
      justify-content: center;

      .question-content {
        padding: 16px 32px;
        overflow: auto;
      }
    }

    .answer-wrapper {
      flex: 1;
      position: relative;
      text-align: center;
      padding: 32px;
      padding-top: 8px;
      padding-bottom: 64px;
      overflow: auto;
      transition: background .2s ease, box-shadow .2s ease;

      &:not(.show-answers) {        
        .select-question-content {
          .select-question-content-span {
            &.select-question-content-option-span {
              cursor: pointer;
              &:hover {
                background: rgba(0,0,0,.05);
              }
            }
          }
        }
      }

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
            border-bottom: 2px solid $secondary-text;
            transition: all .2s ease;

            &.empty-span {
              display: inline-block;
            }
          }
        }
      }

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
              background: #fff;
              padding: 8px 16px;
              font-size: 0.8125em;
              border-radius: 32px;
              margin: 4px;
              box-shadow: 0 4px 32px rgba(0,0,0,.1);
              transition: all .2s ease;

              b {
                color: $primary-color;
              }
            }
          }
        }
      }

      &.show-answers {
        .select-question-content-option-span {
          &.correct-answer {
            // color: $green-color;
            background: rgba($green-color,.1);
            border-bottom-color: $green-color;
          }
          &:not(.correct-answer) {
            // color: $red-color;
            background: rgba($red-color,.1);
            border-bottom-color: $red-color;
          }
        }
        ul.single-question {
          > li {
            label {
              cursor: initial;
            }
            &.correct-answer {
              > input[type=checkbox]:checked ~ label {
                border-color: $green-color;
                box-shadow: 0 4px 32px rgba($green-color, 0.25);
                &::before {
                  border-color: $green-color $green-color transparent transparent;
                }
              }
              > input[type=checkbox]:not(:checked) ~ label {
                border-color: $yellow-color;
                box-shadow: 0 4px 32px rgba($yellow-color, 0.25);
              }
            }
            &:not(.correct-answer) {
              > input[type=checkbox]:checked ~ label {
                border-color: $red-color;
                box-shadow: 0 4px 32px rgba($red-color, 0.25);
                &::before {
                  border-color: $red-color $red-color transparent transparent;
                }
              }
            }
          }
        }
      }

      ul.single-question {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        > li {
          width: calc(50% - 16px);
          margin: 8px;
          font-size: 0.875em;
          box-sizing: border-box;
          transition: background .2s ease;

          @media (max-width: 960px) {
            width: 100%;
          }

          $checked-color: rgba(0,0,0,.25);
          label {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 64px;
            padding: 8px 16px;
            background: #fff;
            color: rgba(0,0,0,.85);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 32px rgba(0,0,0,.1);
            box-sizing: border-box;
            transition: all .2s ease;
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
              transition: border-color .2s ease;
            }

            &:after {
              content: "";
              position: absolute;
              top: 0;
              right: 4px;
              width: 4px;
              height: 8px;
              transform: rotate(45deg);
              transition: border-color .2s ease;
              border: {
                style: solid;
                color: transparent;
                width: 0 2px 2px 0;
              }
            }
          }

          > input[type=checkbox] {
            display: none;

            &:checked ~ label {
              border-color: $checked-color;

              &::before {
                border-color: $checked-color $checked-color transparent transparent;
              }
              &::after {
                border-color: #fff;
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
  }

  .quiz-info-wrapper {
    width: $quiz-info-wrapper-width;
    margin-left: auto;
    background: #eee;
    position: relative;
    text-align: center;
    transition: background .2s ease;

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
        color: $primary-color;
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
        color: rgba(0,0,0,.5);
        transition: all .2s ease;
        &:hover {
          color: $primary-color;
          background: $background-lighter;
        }
      }
    }

    .back-button {
      position: absolute;
      background: $primary-color;
      color: #fff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      bottom: 128px;
      left: -16px;
      z-index: 2;
      box-shadow: 0 4px 32px rgba(0,0,0,.15);
      outline: none;
      cursor: pointer;
      transition: transform .2s ease, background .2s ease;

      &:hover {
        transform: scale(0.95);
        background: $primary-color-lighter;//lighten(rgb(70, 185, 70), 2);
      }

      &:active {
        transform: scale(0.9);
        background: $primary-color-lightest;//lighten(rgb(70, 185, 70), 5);
      }

      &::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        top: 50%;
        left: 50%;
        transform: translate(-30%, -50%) rotate(-45deg);
        border: {
          style: solid;
          color: #fff;
          width: 2px 0 0 2px;
        }
      }
    }

    .action-button {
      position: absolute;
      background: $primary-color;
      color: #fff;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      bottom: 48px;
      left: -32px;
      z-index: 2;
      box-shadow: 0 4px 32px rgba($primary-color, .5);
      outline: none;
      cursor: pointer;
      transition: transform .2s ease, background .2s ease;

      &:hover {
        transform: scale(0.95);
        background: $primary-color-lighter;//lighten(rgb(70, 185, 70), 2);
      }

      &:active {
        transform: scale(0.9);
        background: $primary-color-lightest;//lighten(rgb(70, 185, 70), 5);
      }

      &::after {
        transition: all .2s ease;
      }

      &.accept::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 16px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -65%) rotate(45deg);
        border: {
          style: solid;
          color: #fff;
          width: 0 2px 2px 0;
        }
      }
      
      &.next::after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        top: 50%;
        left: 50%;
        transform: translate(-70%, -50%) rotate(-45deg);
        border: {
          style: solid;
          color: #fff;
          width: 0 2px 2px 0;
        }
      }
    }
  }
}
</style>
