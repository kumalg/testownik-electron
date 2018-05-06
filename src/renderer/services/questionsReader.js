import fs from 'fs'
// import windows1250 from 'windows-1250'

export default {
  readFilesFromFolder (quizPath, files) {
    var questions = []
    for (let file of files) {
      if (file.endsWith('.txt')) {
        // fs.readFileSync(quizPath + '\\' + file, 'utf-8', (err, data) => {
        //   if (err) {
        //     throw new Error(err)
        //   }
        //   const lines = data.split('\n')
        //   if (lines[0].startsWith('X')) {
        //     const question = readXQuestion(file, lines)
        //     questions.push(question)
        //   }
        // })
        const text = fs.readFileSync(quizPath + '\\' + file, 'utf-8')
        const lines = text.split('\n')
        if (lines[0].startsWith('X')) {
          const question = readXQuestion(file, lines)
          questions.push(question)
        }
      }
    }
    return questions
  }
}

function readXQuestion (filename, lines) {
  const correctAnswers = lines[0].substring(1).split('').map((char, index) => {
    return { char: char, index: index }
  }).filter(i => i.char === '1').map(i => i.index)
  const questionContent = lines[1]
  const questionType = lines[1].startsWith('[img]') ? 'image' : 'text'
  const answers = lines.slice(2).map((line, index) => {
    return {
      type: line.startsWith('[img]') ? 'image' : 'text',
      content: line,
      isCorrect: correctAnswers.findIndex(i => i === index) !== -1
    }
  })
  return {
    tag: filename,
    contentType: questionType,
    content: questionContent,
    type: 'single',
    answers: answers
  }
}
