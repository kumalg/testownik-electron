<template>
  <div class="quiz-wrapper" :theme="theme">
    <div class="question-wrapper">
      <div class="question-content-wrapper">
        <div class="question-content">
         <template v-if="quiz && currentQuestion">
           <span v-if="currentQuestion.contentType == 'text'">{{ currentQuestion.content }}</span>
         </template>
        </div>
      </div>
      <div :class="['answer-wrapper', {'show-answers': !acceptVisible}]">
        <template v-if="quiz && currentQuestion">
          <template v-if="currentQuestion.type == 'single'">
            <ul class="single-question">
              <li v-for="(answer, index) in currentQuestion.answers" :key="'answer_' + index" :class="{'correct-answer': answer.isCorrect}">
                <input type="checkbox" :id="'answer_' + index" :disabled="!acceptVisible">
                <label :for="'answer_' + index">
                  <span v-if="answer.type == 'text'">{{ answer.content }}</span>
                  <span v-else>[Image]</span>
                </label>
              </li>
            </ul>
          </template>
          <template v-else>
          </template>
        </template>
      </div>
    </div>
    <div class="quiz-info-wrapper">
      <template v-if="quiz && currentQuestion">
        <div class="stat-item-container submitted-answers-container">
          <h3>Udzielone odpowiedzi</h3>
          <div>ProgressBar</div>
        </div>
        <div class="stat-item-container learned-questions-container">
          <h3>Opanowane pytania</h3>
          <div>ProgressBar</div>
        </div>
        <div class="stat-item-container questions-number-container">
          <h3>Liczba pytań</h3>
          <span>{{ quiz.numberOfQuestions }}</span>
        </div>
        <div class="stat-item-container learning-time-container">
          <h3>Czas nauki</h3>
          <span>{{ quiz.time | moment }}</span>
        </div>
      </template>
      <input type="radio" @click="theme = 'dark'" name="theme">
      <input type="radio" @click="theme = 'light'" name="theme">
      <button :class="['action-button', {'next': !acceptVisible, 'accept': acceptVisible}]" @click="actionButtonClick"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    quizObject: {
      type: Object
    }
  },
  data () {
    return {
      acceptVisible: true,
      theme: 'dark',
      // currentQuestionIndex: 0,
      currentQuestionTag: null,
      quiz: this.quizObject
    }
  },
  methods: {
    actionButtonClick () {
      if (this.acceptVisible) {
        this.checkUserAnswer()
      } else {
        this.randomQuestion()
      }
      this.acceptVisible = !this.acceptVisible
    },
    randomItem (array) {
      return array[Math.floor(Math.random() * array.length)]
    },
    checkUserAnswer () {
      if (this.currentQuestionTag) {
        var quizReoccurrences = this.quiz.reoccurrences.find(r => r.tag === this.currentQuestionTag)
        quizReoccurrences.value--
      }
    },
    randomQuestion () {
      const remainingQuestionsReoccurrences = this.quiz.reoccurrences.filter(r => r.value > 0)
      console.log(remainingQuestionsReoccurrences)
      if (remainingQuestionsReoccurrences.length) {
        const questionTag = this.randomItem(remainingQuestionsReoccurrences).tag
        if (questionTag) {
          this.currentQuestionTag = questionTag
        }
      } else {
        alert('Koniec!')
        this.$router.push('/')
      }
    }
  },
  computed: {
    currentQuestion () {
      if (this.quiz.questions && this.currentQuestionTag) {
        return this.quiz.questions.find(q => q.tag === this.currentQuestionTag)
      }
      return null
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
      > ul.single-question {
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

    .question-content-wrapper {
      min-height: 128px;
      text-align: center;
      font-size: 0.875em;
      display: flex;
      align-items: center;
      justify-content: center;

      .question-content {
        padding: 16px 32px;
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
      overflow-y: auto;
      background: #fafafa;
      box-shadow: 0 0 64px rgba(0,0,0,.15);
      transition: background .2s ease, box-shadow .2s ease;

      &.show-answers {
        > ul.single-question {
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

      > ul.single-question {
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
    width: 300px;
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

      span {
        font-size: 1.75em;
        color: $primary-color;
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
