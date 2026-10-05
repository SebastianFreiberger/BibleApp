import { describe, it, expect } from 'vitest'
import { UI_TEXT } from './i18n'

describe('UI_TEXT', () => {
  it('has the same set of keys in es and en', () => {
    const esKeys = Object.keys(UI_TEXT.es).sort()
    const enKeys = Object.keys(UI_TEXT.en).sort()

    const missingInEn = esKeys.filter(k => !enKeys.includes(k))
    const missingInEs = enKeys.filter(k => !esKeys.includes(k))

    expect(missingInEn, `keys present in es but missing in en: ${missingInEn.join(', ')}`).toEqual([])
    expect(missingInEs, `keys present in en but missing in es: ${missingInEs.join(', ')}`).toEqual([])
  })

  it('has no empty string values in either language', () => {
    for (const lang of ['es', 'en']) {
      const empty = Object.entries(UI_TEXT[lang]).filter(([, v]) => v === '')
      expect(empty, `empty values in ${lang}: ${empty.map(([k]) => k).join(', ')}`).toEqual([])
    }
  })
})
