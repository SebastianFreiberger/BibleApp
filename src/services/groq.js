// Clasifica el estado de ánimo llamando a una Netlify Function (netlify/functions/classify-mood.js),
// así la API key de Groq nunca llega al bundle del cliente.
export async function classifyMood(text, lang = 'es') {
  try {
    const res = await fetch('/api/classify-mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang })
    })
    if (!res.ok) return null
    const { categories } = await res.json()
    return categories
  } catch {
    return null
  }
}
