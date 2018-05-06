<template>
  <div class="quiz-wrapper" :theme="theme">
    <FinishQuizModal v-if="showFinishModal" @close="quitQuiz" />
    <div class="question-wrapper">
      <div class="question-content-wrapper">
        <div class="question-content">
          <transition name="question-content-fade" mode="out-in">
            <div v-if="quiz && currentQuestion" :key="currentQuestion.tag">
              <span v-if="currentQuestion.contentType == 'text'">{{ currentQuestion.content }}</span>
              <img v-else :src="'file:///' + currentQuestion.content">
            </div>
          </transition>
        </div>
      </div>
      <div :class="['answer-wrapper', {'show-answers': !acceptVisible}]">
        <transition name="answers-container-fade" mode="out-in">
          <div v-if="quiz && currentQuestion" :key="currentQuestion.tag">
            <template v-if="currentQuestion.type == 'single'">
              <ul class="single-question">
                <li v-for="(answer, index) in currentQuestion.answers" :key="'answer_' + index" :class="{'correct-answer': answer.isCorrect}">
                  <input type="checkbox" v-model="answers" :value="index" :id="'answer_' + index" :disabled="!acceptVisible">
                  <label :for="'answer_' + index">
                    <span v-if="answer.type == 'text'">{{ answer.content }}</span>
                    <img v-else :src="'file:///' + answer.content">
                  </label>
                </li>
              </ul>
            </template>
            <template v-else>
            </template>
          </div>
        </transition>
      </div>
    </div>
    <div class="quiz-info-wrapper">
      <template v-if="quiz && currentQuestion">
        <div class="stat-item-container submitted-answers-container">
          <h3>Udzielone odpowiedzi</h3>
          <ProgressBar
            :progress="correctAnswersRatio"
            :backgroundColor="theme == 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'"
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
      </template>
      <input type="radio" @click="theme = 'dark'" name="theme">
      <input type="radio" @click="theme = 'light'" name="theme">
      <button class="back-button" @click="quitQuiz"/>
      <button :class="['action-button', {'next': !acceptVisible, 'accept': acceptVisible}]" @click="actionButtonClick"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ProgressBar from './ProgressBar'
import FinishQuizModal from './FinishQuizModal'

export default {
  props: {
    quizObject: {
      type: Object
    }
  },
  components: {
    ProgressBar,
    FinishQuizModal
  },
  data () {
    return {
      acceptVisible: true,
      theme: 'light',
      currentQuestionTag: null,
      quiz: this.quizObject,
      showFinishModal: false,
      answers: []
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
        const correctAnswers = this.currentQuestion.answers
          .map((a, i) => { return {a: a.isCorrect, i: i} })
          .filter(a => a.a)
          .map(a => a.i)
        if (correctAnswers.sort().join(',') === this.answers.sort().join(',')) {
          this.quiz.numberOfCorrectAnswers++
          questionReoccurrences.value--
          if (questionReoccurrences.value === 0) {
            this.quiz.numberOfLearnedQuestions++
          }
        } else {
          this.quiz.numberOfBadAnswers++
          questionReoccurrences.value++
        }
      }

      const remainingQuestionsReoccurrences = this.quiz.reoccurrences.filter(r => r.value > 0)
      if (!remainingQuestionsReoccurrences.length) {
        this.showFinishModal = true
      }
    },
    randomQuestion () {
      const remainingQuestionsReoccurrences = this.quiz.reoccurrences.filter(r => r.value > 0)
      if (remainingQuestionsReoccurrences.length) {
        const questionTag = this.randomItem(remainingQuestionsReoccurrences).tag
        if (questionTag) {
          this.currentQuestionTag = questionTag
        }
      } else {
        this.showFinishModal = true
      }
    }
  },
  computed: {
    currentQuestion () {
      if (this.quiz.questions && this.currentQuestionTag) {
        return this.quiz.questions.find(q => q.tag === this.currentQuestionTag)
      }
      return null
    },
    correctAnswersRatio () {
      return this.quiz.numberOfCorrectAnswers / (this.quiz.numberOfCorrectAnswers + this.quiz.numberOfBadAnswers)
    },
    learnedQuestionsRatio () {
      return this.quiz.numberOfLearnedQuestions / this.quiz.numberOfQuestions
    }
  },
  filters: {
    moment: function (date) {
      const duration = moment.duration(date, 'ms')
      return duration.hours().toFixed().padStart(2, '0') + ':' + duration.minutes().toFixed().padStart(2, '0') + ':' + duration.seconds().toFixed().padStart(2, '0')
    }
  },
  mounted () {
    this.randomQuestion()
    setInterval(function () {
      this.quiz.time += 1000
    }.bind(this), 1000)
  }
}
</script>

<style lang="scss" scoped>
@import '../style/_colors.scss';

.question-content,
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
    background: $background-darker;
    .answer-wrapper {
      background: $background-dark;
      box-shadow: none;
      ul.single-question {
        > li {
          $checked-color: rgba(255,255,255,.15);
          label {
            background: $background-darker;
            color: $primary-text-ondark;
            box-shadow: none;
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
    }
  }
  .quiz-info-wrapper {
    background: $background-darkest;
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
    transition: background .2s ease;
    max-width: calc(100% - #{$quiz-info-wrapper-width});

    .question-content-wrapper {
      min-height: 128px;
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

    $offset-width: 17px;
    .answer-wrapper {
      flex: 1;
      transform: translateX($offset-width);
      text-align: center;
      padding: 32px;
      margin-left: -$offset-width;
      z-index: 1;
      overflow: auto;
      background: #fafafa;
      box-shadow: 0 0 64px rgba(0,0,0,.15);
      transition: background .2s ease, box-shadow .2s ease;

      &.show-answers {
        ul.single-question {
          > li.correct-answer {
            > input[type=checkbox]:checked ~ label {
              border-color: $green-color;
              &::before {
                border-color: $green-color $green-color transparent transparent;
              }
            }
            > input[type=checkbox]:not(:checked) ~ label {
              border-color: $yellow-color;
            }
          }
          > li:not(.correct-answer) {
            > input[type=checkbox]:checked ~ label {
              border-color: $red-color;
              &::before {
                border-color: $red-color $red-color transparent transparent;
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
            box-shadow: 0 4px 32px rgba(0,0,0,.15);
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
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: $quiz-info-wrapper-width;
    margin-left: auto;
    background: #eee;
    position: relative;
    text-align: center;
    transition: background .2s ease;

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
        display: flex;
        font-size: 0.75em;
        .pull-right {
          margin-left: auto;
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
      left: 0;
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
