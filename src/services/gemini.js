const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

const VALID_CATEGORIES = [
  'triste', 'ansioso', 'miedo', 'agradecido', 'esperanza', 'fe',
  'fortaleza', 'amor', 'paz', 'perdido', 'cansado', 'enojado',
  'duelo', 'autoestima', 'relaciones', 'identidad', 'proposito', 'perdon', 'culpa'
]

export async function classifyMood(text, lang = 'es') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return null

  const prompt = lang === 'es'
    ? `El usuario de una app bíblica escribió cómo se siente: "${text}"
Identifica las 1 a 3 categorías emocionales que mejor describen lo que expresa.
Responde ÚNICAMENTE con un array JSON, sin texto adicional, usando solo categorías de esta lista:
${VALID_CATEGORIES.join(', ')}
Ejemplo válido: ["triste", "cansado"]`
    : `A user of a Bible app wrote how they feel: "${text}"
Identify 1 to 3 emotional categories that best describe what they express.
Respond ONLY with a JSON array, no extra text, using only categories from this list:
${VALID_CATEGORIES.join(', ')}
Valid example: ["sad", "tired"]`

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 60 }
      })
    })
    if (!res.ok) return null
    const data = await res.json()
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!raw) return null
    const match = raw.match(/\[[\s\S]*?\]/)
    if (!match) return null
    const parsed = JSON.parse(match[0])
    return Array.isArray(parsed) ? parsed.filter(c => VALID_CATEGORIES.includes(c)) : null
  } catch {
    return null
  }
}
