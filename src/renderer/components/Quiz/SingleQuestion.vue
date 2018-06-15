<template>
<div v-if="currentQuestion.type == 'single'" class="single-question">
  <div class="single-question-content">
    <div class="question-content">
      <span class="mathjax-element" v-if="currentQuestion.contentType == 'text'">{{ currentQuestion.content }}</span>
      <img v-else :src="'file:///' + quiz.location + '/' + currentQuestion.content">
    </div>
  </div>
  <div class="single-question-answers">
    <ul>
      <li v-for="(answer, index) in unsortedAnswers" :key="'answer_' + index" :class="[{'correct-answer': answer.isCorrect}, {'white-background': answer.type == 'image'}]">
        <input type="checkbox" v-model="answers" :value="answer.id" :id="'answer_' + answer.id" :disabled="!acceptVisible">
        <label :for="'answer_' + answer.id">
          <!-- <AnswerCheckboxOption v-if="answer.type == 'text'" :content="answer.content"/> -->
          <span class="mathjax-element" v-if="answer.type == 'text'">{{ answer.content }}</span>
          <img v-else :src="'file:///' + quiz.location + '/' + answer.content" alt="rysunek">
        </label>
      </li>
    </ul>
  </div>
</div>
</template>

