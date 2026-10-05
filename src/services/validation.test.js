import { describe, it, expect } from 'vitest'
import { isValidPhone } from './validation'

describe('isValidPhone', () => {
  it('accepts an empty value since the phone field is optional', () => {
    expect(isValidPhone('')).toBe(true)
    expect(isValidPhone('   ')).toBe(true)
    expect(isValidPhone(undefined)).toBe(true)
  })

  it('accepts common phone formats', () => {
    expect(isValidPhone('+54 9 11 1234-5678')).toBe(true)
    expect(isValidPhone('(011) 1234-5678')).toBe(true)
    expect(isValidPhone('1123456789')).toBe(true)
  })

  it('rejects letters or other invalid characters', () => {
    expect(isValidPhone('abc123456')).toBe(false)
    expect(isValidPhone('1234abc')).toBe(false)
  })

  it('rejects too few digits', () => {
    expect(isValidPhone('123456')).toBe(false)
  })

  it('rejects an unreasonably long number', () => {
    expect(isValidPhone('1234567890123456')).toBe(false)
  })
})
