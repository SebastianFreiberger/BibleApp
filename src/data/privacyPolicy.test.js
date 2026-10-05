import { describe, it, expect } from 'vitest'
import { PRIVACY_POLICY } from './privacyPolicy'

describe('PRIVACY_POLICY', () => {
  it('has both languages with the same number of sections', () => {
    expect(PRIVACY_POLICY.es.sections.length).toBe(PRIVACY_POLICY.en.sections.length)
    expect(PRIVACY_POLICY.es.sections.length).toBeGreaterThan(0)
  })

  it('has no empty titles/paragraphs/updatedAt in either language', () => {
    for (const lang of ['es', 'en']) {
      const content = PRIVACY_POLICY[lang]
      expect(content.updatedAt?.length).toBeGreaterThan(0)
      expect(content.intro?.length).toBeGreaterThan(0)
      for (const section of content.sections) {
        expect(section.title?.length, `empty title in ${lang}`).toBeGreaterThan(0)
        expect(section.body.length, `section "${section.title}" has no paragraphs in ${lang}`).toBeGreaterThan(0)
        for (const paragraph of section.body) {
          expect(paragraph.length, `empty paragraph in "${section.title}" (${lang})`).toBeGreaterThan(0)
        }
      }
    }
  })

  // El dato más sensible de la app (texto libre de ánimo -> IA externa) tiene
  // que estar explícitamente mencionado, en los dos idiomas.
  it('explicitly discloses the mood-text AI processing in both languages', () => {
    const esText = JSON.stringify(PRIVACY_POLICY.es)
    const enText = JSON.stringify(PRIVACY_POLICY.en)
    expect(esText).toContain('Groq')
    expect(enText).toContain('Groq')
  })
})
