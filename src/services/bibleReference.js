// Lógica pura de parseo de referencias bíblicas, compartida entre el cliente
// (src/services/bibleApi.js) y la Netlify Function (netlify/functions/bible-verse.js).
import { BOOK_DATA } from '../data/bibleData.js'

export function parseReference(reference) {
  const parts = reference.split(':')
  const book = parts[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const chapter = parseInt(parts[1])
  const versePart = parts[2]

  let verse, endVerse
  if (versePart.includes('-')) {
    const [start, end] = versePart.split('-')
    verse = parseInt(start)
    endVerse = parseInt(end)
  } else {
    verse = parseInt(versePart)
    endVerse = verse
  }

  return { book, chapter, verse, endVerse }
}

export function formatDisplayReference(reference, lang) {
  const parts = reference.split(':')
  const bookKey = parts[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const bookData = BOOK_DATA[bookKey]

  if (lang === 'en' && bookData) {
    return bookData.en + ' ' + parts[1] + ':' + parts[2]
  }
  return parts[0] + ' ' + parts[1] + ':' + parts[2]
}
