import { Sparkles, CalendarHeart, Shuffle, ArrowLeft, Loader, MessageCircle } from 'lucide-react'
import { GodAttributeCard } from './GodAttributeCard'

export function DailyVerseTab({
  loading,
  currentVerse,
  showRandom,
  loadingRandom,
  generateRandomVerse,
  backToDaily,
  dailyAttribute,
  lang = 'es',
  t
}) {
  const shareOnWhatsApp = () => {
    if (!currentVerse) return

    const sparkles = String.fromCodePoint(0x2728)
    const book = String.fromCodePoint(0x1F4D6)
    const pray = String.fromCodePoint(0x1F64F)
    const dizzy = String.fromCodePoint(0x1F4AB)
    const star = String.fromCodePoint(0x1F31F)
    const crown = String.fromCodePoint(0x1F451)
    const heart = String.fromCodePoint(0x2764)

    let message = `${sparkles} Tu Mensaje de Hoy ${sparkles}

${book} *${currentVerse.reference}*

"${currentVerse.text}"`

    if (dailyAttribute) {
      message += `

${crown} *Dios es ${dailyAttribute.name}*
${heart} ${dailyAttribute.description}`
    }

    message += `

${pray} Que este mensaje bendiga tu día ${dizzy}

───────────────
${star} _Tu Mensaje de Hoy_`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>{t.loading}</p>
      </div>
    )
  }

  if (!currentVerse) return null

  return (
    <div className="verse-container">
      {dailyAttribute && (
        <GodAttributeCard attribute={dailyAttribute} t={t} lang={lang} />
      )}

      {showRandom && (
        <span className="verse-badge">
          <Sparkles size={16} className="badge-icon badge-icon-sparkle" /> {t.randomBadge}
        </span>
      )}
      {!showRandom && (
        <span className="verse-badge daily">
          <CalendarHeart size={16} className="badge-icon badge-icon-daily" /> {t.dailyBadge}
        </span>
      )}
      <div className="verse-card">
        <blockquote className="verse-text">
          "{currentVerse.text}"
        </blockquote>
        <cite className="verse-reference">
          — {currentVerse.reference}
        </cite>
      </div>

      <div className="buttons">
        {showRandom && (
          <button className="btn btn-secondary" onClick={backToDaily}>
            <ArrowLeft size={18} className="btn-icon btn-icon-back" /> {t.backToDaily}
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={generateRandomVerse}
          disabled={loadingRandom}
        >
          {loadingRandom
            ? <Loader size={18} className="spin" />
            : <Shuffle size={18} className="btn-icon btn-icon-shuffle" />
          } {t.generateRandom}
        </button>
        <button
          className="btn btn-whatsapp"
          onClick={shareOnWhatsApp}
        >
          <MessageCircle size={18} className="btn-icon" /> {t.shareWhatsApp}
        </button>
      </div>
    </div>
  )
}
