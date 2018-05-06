export const sampleQuiz = {
  numberOfQuestions: 3,
  numberOfLearnedQuestions: 1,
  numberOfCorrectAnswers: 4,
  numberOfBadAnswers: 3,
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
      content: 'Tak (T)',
      isCorrect: true
    }, {
      type: 'text',
      content: 'No tak średnio bym powiedział',
      isCorrect: false
    }, {
      type: 'text',
      content: 'Nie wiem, choć się domyślam (T)',
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
      content: 'Stado (T)',
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
      content: 'Tak (T)',
      isCorrect: true
    }, {
      type: 'text',
      content: 'Nie',
      isCorrect: false
    }]
  }]
}
