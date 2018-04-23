<template>
  <div class="quiz-wrapper" :theme="theme">
    <div class="question-wrapper">
      <div class="question-content-wrapper">
        <div class="question-content">
         Czy pytania będą łatwe?
        </div>
      </div>
      <div :class="['answer-wrapper', {'show-answers': !acceptVisible}]">
        <ul class="single-question">
          <li class="correct-answer">
            <input type="checkbox" id="answer_1" :disabled="!acceptVisible">
            <label for="answer_1">
              <span>Tak [poprawna]</span>
            </label>     
          </li>
          <li>
            <input type="checkbox" id="answer_2" :disabled="!acceptVisible">
            <label for="answer_2">
              <span>Nie</span>
            </label>
          </li>
          <li class="correct-answer">
            <input type="checkbox" id="answer_3" :disabled="!acceptVisible">
            <label for="answer_3">
              <span>Nie wiem, choć się domyślam [poprawna]</span>
            </label>     
          </li>
          <li>
            <input type="checkbox" id="answer_4" :disabled="!acceptVisible">
            <label for="answer_4">
              <span>Wiem, ale nie powiem</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
    <div class="quiz-info-wrapper">
      <div class="stat-item-container submitted-answers-container">
        <h3>Udzielone odpowiedzi</h3>
      </div>
      <div class="stat-item-container learned-questions-container">
        <h3>Opanowane pytania</h3>
      </div>
      <div class="stat-item-container questions-number-container">
        <h3>Liczba pytań</h3>
      </div>
      <div class="stat-item-container learning-time-container">
        <h3>Czas nauki</h3>
      </div>
      <input type="radio" @click="theme = 'dark'" name="theme">
      <input type="radio" @click="theme = 'light'" name="theme">
      <button :class="['action-button', {'next': !acceptVisible, 'accept': acceptVisible}]" @click="acceptVisible = !acceptVisible"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      acceptVisible: true,
      theme: 'dark'
    }
  }
}
</script>

<style lang="scss" scoped>

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
  color: rgba(255,255,255,.75);
  .question-wrapper {
    background: mix(#1c1d1f, #222327);
    .answer-wrapper {
      background: #222327;
      box-shadow: none;
      //  &.show-answers {
      //   > ul.single-question {
      //     > li.correct-answer {
      //       $good-unselected-answer: rgb(255, 219, 58);
      //       > input[type=checkbox]:not(:checked) ~ label {
      //         &::after {
      //           border-color: #000;
      //         }
      //       }
      //     }
      //   }
      // }
      > ul.single-question {
        > li {
          $checked-color: rgba(255,255,255,.1);
          label {
            background: mix(#1c1d1f, #222327);
            color: rgba(255,255,255,.75);
            box-shadow: none;
          }
          > input[type=checkbox]:checked ~ label {
            border-color: $checked-color;
            &::before {
              border-color: $checked-color $checked-color transparent transparent;
            }
            &::after {
              border-color: #000;
            }
          }
        }
      }
    }
  }
  .quiz-info-wrapper {
    background: #1c1d1f;
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
            $good-selected-answer: rgb(104, 226, 100);
            > input[type=checkbox]:checked ~ label {
              border-color: $good-selected-answer;
              &::before {
                border-color: $good-selected-answer $good-selected-answer transparent transparent;
              }
            }
            $good-unselected-answer: rgb(255, 219, 58);
            > input[type=checkbox]:not(:checked) ~ label {
              border-color: $good-unselected-answer;
            }
          }
          > li:not(.correct-answer) {
            $bad-selected-answer: rgb(241, 81, 81);
            > input[type=checkbox]:checked ~ label {
              border-color: $bad-selected-answer;
              &::before {
                border-color: $bad-selected-answer $bad-selected-answer transparent transparent;
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
          height: 64px;
          box-sizing: border-box;
          transition: background .2s ease;

          @media (max-width: 960px) {
            width: 100%;
          }

          $checked-color: #bbb;
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
            
            &:hover {
              transform: scale(0.98);
            }

            &:active {
              transform: scale(0.96);
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
    }

    .action-button {
      position: absolute;
      background: rgb(70, 185, 70);
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
        background: lighten(rgb(70, 185, 70), 2);
      }

      &:active {
        transform: scale(0.9);
        background: lighten(rgb(70, 185, 70), 5);
      }

      &::after {
        transition: all .2s ease;
      }

      &.accept::after {
        content: '';
        position: absolute;
        width: 12px;
        height: 24px;
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
        width: 16px;
        height: 16px;
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
