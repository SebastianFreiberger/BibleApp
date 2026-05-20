import { BOOK_DATA } from '../data'

// Funcion para parsear referencia: "Salmos:34:18" -> { book, chapter, verse, endVerse }
function parseReference(reference) {
  const parts = reference.split(':')
  const book = parts[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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

// Funcion para formatear referencia para mostrar
function formatDisplayReference(reference, lang) {
  const parts = reference.split(':')
  const bookKey = parts[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const bookData = BOOK_DATA[bookKey]
  
  if (lang === 'en' && bookData) {
    return bookData.en + ' ' + parts[1] + ':' + parts[2]
  }
  return parts[0] + ' ' + parts[1] + ':' + parts[2]
}

// Funcion para obtener versiculo de bolls.life (español)
async function fetchVerseSpanish(reference) {
  try {
    const parsed = parseReference(reference)
    const bookData = BOOK_DATA[parsed.book]
    
    if (!bookData) {
      console.error('Libro no encontrado:', parsed.book)
      throw new Error('Libro no encontrado: ' + parsed.book)
    }
    
    const url = `https://bolls.life/get-text/RV1960/${bookData.id}/${parsed.chapter}/`
    
    console.log('Fetching Spanish verse from:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('API response not ok:', response.status)
      throw new Error('Error API: ' + response.status)
    }
    
    const data = await response.json()
    console.log('API response length:', data.length)
    
    if (data && Array.isArray(data)) {
      const versesToGet = []
      for (let v = parsed.verse; v <= parsed.endVerse; v++) {
        const found = data.find(item => item.verse === v)
        if (found) {
          versesToGet.push(found.text.replace(/<[^>]*>/g, ''))
        }
      }
      
      if (versesToGet.length > 0) {
        return {
          reference: formatDisplayReference(reference, 'es'),
          text: versesToGet.join(' ').trim()
        }
      }
    }
    
    console.error('Verses not found in chapter data')
    throw new Error('No data')
  } catch (error) {
    console.error('Error fetching Spanish verse:', error)
    return {
      reference: formatDisplayReference(reference, 'es'),
      text: 'No se pudo cargar el versículo. Verifica tu conexión a internet.'
    }
  }
}

// Funcion para obtener versiculo de bible-api.com (inglés)
async function fetchVerseEnglish(reference) {
  try {
    const parsed = parseReference(reference)
    const bookData = BOOK_DATA[parsed.book]
    
    if (!bookData) {
      throw new Error('Book not found: ' + parsed.book)
    }
    
    const verseRange = parsed.verse === parsed.endVerse 
      ? parsed.verse 
      : parsed.verse + '-' + parsed.endVerse
    
    const url = 'https://bible-api.com/' + bookData.en.toLowerCase().replace(/ /g, '+') + '+' + parsed.chapter + ':' + verseRange
    
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error API')
    
    const data = await response.json()
    return {
      reference: formatDisplayReference(reference, 'en'),
      text: data.text ? data.text.trim() : 'Verse not available'
    }
  } catch (error) {
    console.error('Error fetching English verse:', error)
    return {
      reference: formatDisplayReference(reference, 'en'),
      text: 'Could not load verse. Check your internet connection.'
    }
  }
}

// Funcion principal para obtener versiculo segun idioma
export async function fetchVerse(reference, lang) {
  if (lang === 'es') {
    return fetchVerseSpanish(reference)
  } else {
    return fetchVerseEnglish(reference)
  }
}

// Funcion para obtener multiples versiculos
export async function fetchMultipleVerses(references, lang) {
  const promises = references.map(ref => fetchVerse(ref, lang))
  return Promise.all(promises)
}
