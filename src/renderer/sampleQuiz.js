import store from './store'

export const sampleQuiz = {
  numberOfQuestions: 3,
  numberOfLearnedQuestions: 0,
  numberOfCorrectAnswers: 0,
  numberOfBadAnswers: 0,
  time: 0,
  reoccurrences: [
    { tag: '001.txt', value: store.state.reoccurrencesOnStart },
    { tag: '002.txt', value: store.state.reoccurrencesOnStart },
    { tag: '003.txt', value: store.state.reoccurrencesOnStart }
  ],
  questions: [{
    tag: '001.txt',
    contentType: 'text',
    content: 'Czy pytania będa łatwe?',
    type: 'single',
    answers: [{
      id: 1,
      type: 'text',
      content: '1 Tak (T)',
      isCorrect: true
    }, {
      id: 2,
      type: 'text',
      content: '2 No tak średnio bym powiedział',
      isCorrect: false
    }, {
      id: 3,
      type: 'text',
      content: '3. Nie wiem, choć się domyślam (T)',
      isCorrect: true
    }, {
      id: 4,
      type: 'text',
      content: '4. Wiem, ale nie powiem',
      isCorrect: false
    }]
  }, {
    tag: '002.txt',
    contentType: 'text',
    content: 'Więcej niż jedno zwierze to:',
    type: 'single',
    answers: [{
      id: 1,
      type: 'text',
      content: '1. Owca',
      isCorrect: false
    }, {
      id: 2,
      type: 'text',
      content: '2. Stado (T)',
      isCorrect: true
    }, {
      id: 3,
      type: 'text',
      content: '3. Lama',
      isCorrect: false
    }]
  }, {
    tag: '003.txt',
    contentType: 'text',
    content: 'Czy vue.js to cudowny framework?',
    type: 'single',
    answers: [{
      id: 1,
      type: 'text',
      content: '1. Tak (T)',
      isCorrect: true
    }, {
      id: 2,
      type: 'text',
      content: '2. Nie',
      isCorrect: false
    }]
  }]
}
