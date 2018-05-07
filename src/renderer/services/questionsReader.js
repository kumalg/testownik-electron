import fs from 'fs'
import { promisify } from 'util'
const readFileAsync = promisify(fs.readFile)
// import windows1250 from 'windows-1250'

export default {
  async readFilesFromFolder (quizPath, files) {
    const getQuestionFromFile = async filename => {
      const text = await readFileAsync(quizPath + '/' + filename, 'utf-8')
      return getQuestionFromText(text, quizPath, filename)
    }

    const questionPromises =
      files
        .filter(filename => filename.endsWith('.txt'))
        .map(getQuestionFromFile)

    return Promise.all(questionPromises).then(qs => qs.filter(q => q !== null))
  }
}

function getQuestionFromText (text, quizPath, filename) {
  const lines = text.split('\n')
  if (lines[0].startsWith('X')) {
    return readXQuestion(quizPath, filename, lines)
  } else return null
}

function readXQuestion (quizPath, filename, lines) {
  const correctAnswers = lines[0].substring(1).split('').map((char, index) => {
    return { char: char, index: index }
  }).filter(i => i.char === '1').map(i => i.index)
  const questionType = lines[1].startsWith('[img]') ? 'image' : 'text'
  const questionContent = questionType === 'image' ? quizPath.replace('\\', '/') + '/' + lines[1].replace('[img]', '').replace('[/img]', '') : lines[1]
  const answers = lines.slice(2).filter(l => l.replace(/^\s*/, '').replace(/\s*$/, '').length !== 0).map((line, index) => {
    return {
      id: index,
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
