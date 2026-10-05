import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import handler from '../classify-mood.js'

function req(body, { method = 'POST' } = {}) {
  return new Request('http://localhost/api/classify-mood', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  })
}

function mockGroqResponse(content, ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    text: async () => 'error body',
    json: async () => ({ choices: [{ message: { content } }] }),
  }))
}

beforeEach(() => {
  vi.stubEnv('GROQ_API_KEY', 'test-key')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('classify-mood function', () => {
  it('rejects non-POST requests', async () => {
    const res = await handler(req(null, { method: 'GET' }))
    expect(res.status).toBe(405)
  })

  it('returns null categories (not an error) when GROQ_API_KEY is not configured', async () => {
    vi.unstubAllEnvs()
    const res = await handler(req({ text: 'me siento triste', lang: 'es' }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.categories).toBeNull()
  })

  it('rejects an invalid JSON body', async () => {
    const res = await handler(new Request('http://localhost/api/classify-mood', {
      method: 'POST',
      body: '{not json',
    }))
    expect(res.status).toBe(400)
  })

  it('rejects missing/empty text', async () => {
    const res = await handler(req({ text: '   ', lang: 'es' }))
    expect(res.status).toBe(400)
  })

  it('returns matched categories for a valid Groq response', async () => {
    mockGroqResponse('["triste", "miedo"]')
    const res = await handler(req({ text: 'estoy triste y con miedo', lang: 'es' }))
    const body = await res.json()
    expect(body.categories).toEqual(['triste', 'miedo'])
  })

  it('filters out categories the model hallucinates outside the valid list', async () => {
    mockGroqResponse('["triste", "alienigena", "miedo"]')
    const res = await handler(req({ text: 'texto', lang: 'es' }))
    const body = await res.json()
    expect(body.categories).toEqual(['triste', 'miedo'])
  })

  it('tolerates extra reasoning text around the JSON array', async () => {
    mockGroqResponse('Sure, here it is: ["agradecido"] — hope that helps!')
    const res = await handler(req({ text: 'texto', lang: 'es' }))
    const body = await res.json()
    expect(body.categories).toEqual(['agradecido'])
  })

  it('returns null categories when the model output has no JSON array', async () => {
    mockGroqResponse('lo siento, no puedo ayudar con eso')
    const res = await handler(req({ text: 'texto', lang: 'es' }))
    const body = await res.json()
    expect(body.categories).toBeNull()
  })

  it('returns null categories when the Groq API call fails', async () => {
    mockGroqResponse('', false)
    const res = await handler(req({ text: 'texto', lang: 'es' }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.categories).toBeNull()
  })

  it('returns null categories when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const res = await handler(req({ text: 'texto', lang: 'es' }))
    const body = await res.json()
    expect(body.categories).toBeNull()
  })

  it('truncates text beyond 500 chars before sending it upstream', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '["cansado"]' } }] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const longText = 'a'.repeat(1000)
    await handler(req({ text: longText, lang: 'es' }))

    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    const userMessage = sentBody.messages.find(m => m.role === 'user')
    expect(userMessage.content.length).toBe(500)
  })

  it('defaults to Spanish when lang is missing or unrecognized', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: '["paz"]' } }] }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await handler(req({ text: 'texto' }))

    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    const systemMessage = sentBody.messages.find(m => m.role === 'system')
    expect(systemMessage.content).toContain('asistente espiritual')
  })
})
