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
          const question = readXQuestion(quizPath, file, lines)
          questions.push(question)
        }
      }
    }
    return questions
  }
}

function readXQuestion (quizPath, filename, lines) {
  const correctAnswers = lines[0].substring(1).split('').map((char, index) => {
    return { char: char, index: index }
  }).filter(i => i.char === '1').map(i => i.index)
  const questionType = lines[1].startsWith('[img]') ? 'image' : 'text'
  const questionContent = questionType === 'image' ? quizPath.replace('\\', '/') + '/' + lines[1].replace('[img]', '').replace('[/img]', '') : lines[1]
  const answers = lines.slice(2).filter(l => l.replace(/^\s*/, '').replace(/\s*$/, '').length !== 0).map((line, index) => {
    return {
      type: line.startsWith('[img]') ? 'image' : 'text',
      content: line.startsWith('[img]') ? quizPath.replace('\\', '/') + '/' + line.replace('[img]', '').replace('[/img]', '') : line,
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
