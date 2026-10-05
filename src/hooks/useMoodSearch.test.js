import { describe, it, expect } from 'vitest'
import Fuse from 'fuse.js'
import { createSearchIndex, fuseSearch } from './useMoodSearch'

const FUSE_OPTIONS = {
  keys: ['text'],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true
}

function makeFuse(lang) {
  return new Fuse(createSearchIndex(lang), FUSE_OPTIONS)
}

describe('fuseSearch (mood matching)', () => {
  it('matches an exact Spanish keyword to its category', () => {
    const result = fuseSearch('triste', 'es', makeFuse('es'))
    expect(result?.key).toBe('triste')
  })

  it('matches an exact English keyword to its category', () => {
    const result = fuseSearch('anxious', 'en', makeFuse('en'))
    expect(result?.key).toBe('ansioso')
  })

  it('matches a keyword embedded in a full sentence', () => {
    const result = fuseSearch('me siento muy agradecido hoy', 'es', makeFuse('es'))
    expect(result?.key).toBe('agradecido')
  })

  it('returns null for an empty query', () => {
    expect(fuseSearch('', 'es', makeFuse('es'))).toBeNull()
    expect(fuseSearch('   ', 'es', makeFuse('es'))).toBeNull()
  })

  it('returns null for text with no plausible match', () => {
    const result = fuseSearch('asdkjaslkdj qwerty 12345', 'es', makeFuse('es'))
    expect(result).toBeNull()
  })
})
