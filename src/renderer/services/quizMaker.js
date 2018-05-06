export default {
  prepareQuizObject (questions) {
    const quiz = {
      numberOfQuestions: questions.length,
      numberOfLearnedQuestions: 0,
      numberOfCorrectAnswers: 0,
      numberOfBadAnswers: 0,
      time: 0,
      reoccurrences: questions.map(q => {
        return {
          tag: q.tag,
          value: 2
        }
      }),
      questions: questions
    }
    console.log(questions)
    return quiz
  }
}
