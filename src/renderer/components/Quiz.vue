<template>
  <div class="quiz-wrapper">
    <div class="question-wrapper">
      <div class="question-content-wrapper">
        <div class="question-content">
         Czy pytania będą trudne?
        </div>
      </div>
      <div class="answer-wrapper">
        <ul class="single-question">
          <li>
            <input type="checkbox" id="answer_1">
            <label for="answer_1">
              <span>Tak</span>
            </label>     
          </li>
          <li>
            <input type="checkbox" id="answer_2">
            <label for="answer_2">
              <span>Nie</span>
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
      <button class="accept-button">
        Dalej
      </button>
    </div>
  </div>
</template>

<script>
export default {}
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

.quiz-wrapper {
  background: green;
  height: 100vh;
  display: flex;
  align-items: stretch;

  .question-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fafafa;

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

    .answer-wrapper {
      flex: 1;
      transform: translateX(16px);
      text-align: center;
      padding: 32px;
      margin-left: -16px;
      z-index: 1;
      background: inherit;
      box-shadow: 0 0 64px rgba(0,0,0,.15);

      > ul.single-question {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        > li {
          // max-width: 320px;
          background: red;
          width: calc(50% - 16px);
          margin: 8px;
          font-size: 0.875em;
          height: 64px;
          box-sizing: border-box;
          transition: background .2s ease;

          @media (max-width: 960px) {
            width: 100%;
          }

          label {
            width: 100%;
            height: 100%;
            min-height: 64px;
            padding: 8px 16px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            // border-radius: 4px;
            box-shadow: 0 4px 32px rgba(0,0,0,.15);
            transition: all .2s ease;
            cursor: pointer;

            border: {
              style: solid;
              color: transparent;
              width: 2px;
            }
            
            &:hover {
              border-color: #dadada;
            }
          }

          > input[type=checkbox] {
            display: none;

            &:checked ~ label {
              border-color: #bbb;
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
    width: 256px;
    margin-left: auto;
    background: #eee;
    position: relative;
    text-align: center;

    .stat-item-container {
      margin: 16px 0;

      h3 {
        font-size: 0.8125em;
        font-weight: 600;
      }
    }

    .accept-button {
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
    }
  }
}
</style>
