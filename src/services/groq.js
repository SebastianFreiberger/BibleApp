const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const VALID_CATEGORIES = [
  'triste', 'ansioso', 'miedo', 'agradecido', 'esperanza', 'fe',
  'fortaleza', 'amor', 'paz', 'perdido', 'cansado', 'enojado',
  'duelo', 'autoestima', 'relaciones', 'identidad', 'proposito', 'perdon', 'culpa'
]

const SYSTEM_PROMPT = `Eres un asistente espiritual de una app bíblica. Tu única tarea es identificar las emociones presentes en el texto del usuario y mapearlas a categorías específicas.

Categorías disponibles y lo que cubren:
- triste: tristeza, melancolía, llanto, pena, depresión
- ansioso: preocupación, nerviosismo, angustia, estrés, agobiado
- miedo: temor, terror, inseguridad ante peligro, fobia
- agradecido: gratitud, agradecimiento, contento, feliz, alegre
- esperanza: optimismo, ilusión, futuro mejor, expectativa positiva
- fe: confianza en Dios, creer, espiritualidad, oración
- fortaleza: necesidad de fuerza, resistencia, valentía, perseverancia
- amor: amor romántico, afecto, querer a alguien, familia
- paz: calma, serenidad, tranquilidad, descanso mental
- perdido: soledad, solo, desorientado, sin rumbo, vacío, aislado
- cansado: agotamiento, fatiga, rendido, sin energía, burnout
- enojado: ira, rabia, frustración, molestia, indignación
- duelo: pérdida, luto, muerte de ser querido, extrañar
- autoestima: inseguridad, baja autoestima, sentirse inferior, rechazo
- relaciones: conflictos con otros, problemas de pareja/familia/amigos
- identidad: quién soy, búsqueda de sentido, existencial
- proposito: sin dirección, qué hacer con mi vida, vocación
- perdon: necesito perdonar o ser perdonado, rencor, resentimiento
- culpa: culpabilidad, vergüenza, remordimiento, arrepentimiento

Responde ÚNICAMENTE con un array JSON con 1 a 3 categorías. Sin explicaciones ni texto adicional.
Ejemplo: ["ansioso", "agradecido"]`

const SYSTEM_PROMPT_EN = `You are a spiritual assistant for a Bible app. Your only task is to identify the emotions in the user's text and map them to specific categories.

Available categories:
triste (sadness), ansioso (anxiety), miedo (fear), agradecido (gratitude), esperanza (hope), fe (faith), fortaleza (strength), amor (love), paz (peace), perdido (lost/lonely), cansado (weariness), enojado (anger), duelo (grief), autoestima (self-worth), relaciones (relationships), identidad (identity), proposito (purpose), perdon (forgiveness), culpa (guilt)

Respond ONLY with a JSON array of 1 to 3 categories. No explanations.
Example: ["ansioso", "agradecido"]`

export async function classifyMood(text, lang = 'es') {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: lang === 'es' ? SYSTEM_PROMPT : SYSTEM_PROMPT_EN },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
        max_tokens: 60,
      })
    })

    if (!res.ok) {
      console.warn('[Groq] API error:', res.status, await res.text())
      return null
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content?.trim()
    if (!raw) return null

    const match = raw.match(/\[[\s\S]*?\]/)
    if (!match) return null

    const parsed = JSON.parse(match[0])
    return Array.isArray(parsed) ? parsed.filter(c => VALID_CATEGORIES.includes(c)) : null
  } catch {
    return null
  }
}
