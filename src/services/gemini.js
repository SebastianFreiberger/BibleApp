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
Identifica las 1 a 3 categorías emocionales que mejor describen TODAS las emociones presentes.
Si expresa emociones mixtas o contradictorias, incluí todas las relevantes.

Cada categoría cubre:
- triste: tristeza, melancolía, llanto, pena
- ansioso: preocupación, nerviosismo, angustia, estrés
- miedo: temor, terror, fobia, inseguridad ante peligro
- agradecido: gratitud, agradecimiento, gracias a Dios
- esperanza: optimismo, ilusión, futuro mejor, alegría, contento, felicidad
- fe: confianza en Dios, creer, espiritualidad
- fortaleza: necesidad de fuerza, resistencia, valentía
- amor: amor romántico, afecto, querer a alguien
- paz: calma, serenidad, tranquilidad, descanso mental
- perdido: soledad, solo, desorientado, sin rumbo, vacío, aislado
- cansado: agotamiento, fatiga, rendido, sin energía
- enojado: ira, rabia, frustración, molestia
- duelo: pérdida, luto, muerte de ser querido
- autoestima: inseguridad, baja autoestima, no valerse
- relaciones: conflictos con otros, problemas de pareja/familia/amigos
- identidad: quién soy, propósito de vida, búsqueda de sentido
- proposito: sin dirección, qué hacer con mi vida
- perdon: necesito perdonar o que me perdonen
- culpa: culpabilidad, vergüenza, remordimiento

Responde ÚNICAMENTE con un array JSON, sin texto adicional.
Ejemplo: ["triste", "perdido"]`
    : `A user of a Bible app wrote how they feel: "${text}"
Identify 1 to 3 emotional categories that best describe ALL emotions present.
If they express mixed or contradictory emotions, include all relevant ones.

Each category covers:
- triste: sadness, melancholy, crying, grief
- ansioso: worry, nervousness, anguish, stress
- miedo: fear, terror, phobia, insecurity about danger
- agradecido: gratitude, thankfulness, thanks to God
- esperanza: optimism, hope, better future, joy, happiness, contentment
- fe: trust in God, belief, spirituality
- fortaleza: need for strength, resilience, courage
- amor: romantic love, affection, caring for someone
- paz: calm, serenity, tranquility, mental rest
- perdido: loneliness, alone, disoriented, lost, empty, isolated
- cansado: exhaustion, fatigue, giving up, no energy
- enojado: anger, rage, frustration, annoyance
- duelo: loss, mourning, death of loved one
- autoestima: insecurity, low self-esteem
- relaciones: conflicts with others, relationship problems
- identidad: who am I, search for meaning
- proposito: no direction, what to do with my life
- perdon: need to forgive or be forgiven
- culpa: guilt, shame, remorse

Respond ONLY with a JSON array, no extra text.
Valid example: ["triste", "perdido"]`

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
