import { describe, it, expect } from 'vitest'
import { parseReference, formatDisplayReference } from './bibleReference'

describe('parseReference', () => {
  it('parses a single-verse reference', () => {
    expect(parseReference('Romanos:12:6')).toEqual({
      book: 'romanos', chapter: 12, verse: 6, endVerse: 6
    })
  })

  it('parses a verse-range reference', () => {
    expect(parseReference('2 Corintios:1:3-4')).toEqual({
      book: '2 corintios', chapter: 1, verse: 3, endVerse: 4
    })
  })

  it('strips accents from the book key', () => {
    expect(parseReference('Isaias:41:10').book).toBe('isaias')
    expect(parseReference('Génesis:1:1').book).toBe('genesis')
  })

  it('lowercases multi-word book names', () => {
    expect(parseReference('1 Corintios:13:4-7').book).toBe('1 corintios')
  })
})

describe('formatDisplayReference', () => {
  it('keeps the Spanish book name for lang=es', () => {
    expect(formatDisplayReference('Romanos:12:6', 'es')).toBe('Romanos 12:6')
  })

  it('translates the book name for lang=en when known', () => {
    expect(formatDisplayReference('Romanos:12:6', 'en')).toBe('Romans 12:6')
  })

  it('falls back to the original book token for lang=en when unknown', () => {
    expect(formatDisplayReference('LibroFalso:1:1', 'en')).toBe('LibroFalso 1:1')
  })

  it('formats verse ranges correctly', () => {
    expect(formatDisplayReference('Filipenses:4:6-7', 'es')).toBe('Filipenses 4:6-7')
  })
})
