import fs from 'fs'
import { promisify } from 'util'
import windows1250 from 'windows-1250'
import encodingDetector from './encodingDetector'
const readFileAsync = promisify(fs.readFile)

export default {
  async readFilesFromFolder (quizPath, files) {
    const getQuestionFromFile = async filename => {
      const textBuffer = await readFileAsync(quizPath + '/' + filename)
      return getQuestionFromBuffer(textBuffer, quizPath, filename)
    }

    const questionPromises =
      files
        .filter(filename => filename.endsWith('.txt'))
        .map(getQuestionFromFile)

    return Promise.all(questionPromises).then(qs => qs.filter(q => q !== null))
  }
}

function decodeBuffer (textBuffer) {
  if (encodingDetector.isUTF8(textBuffer)) {
    return textBuffer.toString('utf-8')
  } else {
    const binary = textBuffer.toString('binary')
    return windows1250.decode(binary)
  }
}

function getQuestionFromBuffer (textBuffer, quizPath, filename) {
  const text = decodeBuffer(textBuffer)
  const lines = text.split('\n')
  const firstLine = lines[0].trim()
  if (firstLine.startsWith('X')) {
    return readXQuestion(quizPath, filename, lines)
  } else return null
}

function readXQuestion (quizPath, filename, lines) {
  const correctAnswers = lines[0].trim().substring(1).split('').map((char, index) => {
    return { char: char, index: index }
  }).filter(i => i.char === '1').map(i => i.index)
  const questionType = lines[1].trim().startsWith('[img]') ? 'image' : 'text'
  const questionContent = questionType === 'image' ? quizPath.replace('\\', '/') + '/' + lines[1].replace('[img]', '').replace('[/img]', '') : lines[1]
  const answers = lines.slice(2).filter(l => l.replace(/^\s*/, '').replace(/\s*$/, '').length !== 0).map((line, index) => {
    line = line.trim()
    return {
      id: index,
      type: line.startsWith('[img]') ? 'image' : 'text',
      content: line.startsWith('[img]') ? quizPath.replace('\\', '/') + '/' + line.replace('[img]', '').replace('[/img]', '') : line,
      isCorrect: correctAnswers.findIndex(i => i === index) !== -1
    }
  })
  const question = {
    tag: filename,
    contentType: questionType,
    content: questionContent,
    type: 'single',
    answers: answers
  }
  return question
}
