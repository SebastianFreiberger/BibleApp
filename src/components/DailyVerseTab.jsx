import { useState, useRef, useEffect } from 'react'
import { Sparkles, CalendarHeart, Shuffle, ArrowLeft, Loader, Heart, Share2, MessageCircle, Twitter, Facebook, Copy, Check } from 'lucide-react'
import { GodAttributeCard } from './GodAttributeCard'

export function DailyVerseTab({
  loading,
  currentVerse,
  showRandom,
  loadingRandom,
  generateRandomVerse,
  backToDaily,
  dailyAttribute,
  isFavorite,
  onToggleFavorite,
  t
}) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareRef = useRef(null)

  useEffect(() => {
    if (!showShareMenu) return
    const handler = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showShareMenu])

  const getShareText = () => {
    if (!currentVerse) return ''
    return `"${currentVerse.text}"\n— ${currentVerse.reference}`
  }

  const getWhatsAppMessage = () => {
    if (!currentVerse) return ''
    const sparkles = '✨'
    const book = '📖'
    const pray = '🙏'
    const dizzy = '💫'
    const star = '🌟'
    const crown = '👑'
    const heartEmoji = '❤️'

    let message = `${sparkles} Tu Mensaje de Hoy ${sparkles}\n\n${book} *${currentVerse.reference}*\n\n"${currentVerse.text}"`

    if (dailyAttribute) {
      message += `\n\n${crown} *Dios es ${dailyAttribute.name}*\n${heartEmoji} ${dailyAttribute.description}`
    }

    message += `\n\n${pray} Que este mensaje bendiga tu día ${dizzy}\n\n───────────────\n${star} _Tu Mensaje de Hoy_`
    return message
  }

  const handleShare = async () => {
    if (!currentVerse) return
    if (navigator.share) {
      try {
        await navigator.share({ title: currentVerse.reference, text: getShareText() })
      } catch {
        // usuario canceló
      }
      return
    }
    setShowShareMenu(o => !o)
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getWhatsAppMessage())}`, '_blank')
    setShowShareMenu(false)
  }

  const shareTwitter = () => {
    const text = getShareText()
    const tweet = text.length > 250 ? text.substring(0, 247) + '…' : text
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank')
    setShowShareMenu(false)
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(getShareText())}`, '_blank')
    setShowShareMenu(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback silencioso
    }
    setShowShareMenu(false)
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

  const favorited = isFavorite(currentVerse.reference, currentVerse.text)

  return (
    <div className="verse-container">
      {showRandom ? (
        <span className="verse-badge">
          <Sparkles size={16} className="badge-icon badge-icon-sparkle" /> {t.randomBadge}
        </span>
      ) : (
        <span className="verse-badge daily">
          <CalendarHeart size={16} className="badge-icon badge-icon-daily" /> {t.dailyBadge}
        </span>
      )}

      <div className="verse-card">
        <div className="verse-card-actions">
          <div className="verse-card-actions-left">
            {showRandom && (
              <button className="vc-icon-btn" onClick={backToDaily} title={t.backToDaily}>
                <ArrowLeft size={16} />
              </button>
            )}
            <button
              className="vc-random-btn"
              onClick={generateRandomVerse}
              disabled={loadingRandom}
            >
              {loadingRandom
                ? <Loader size={14} className="spin" />
                : <Shuffle size={14} />
              }
              {t.generateRandom}
            </button>
          </div>

          <div className="verse-card-actions-right">
            <div className="share-wrapper" ref={shareRef}>
              <button
                className="share-btn"
                onClick={handleShare}
                title={t.share}
                aria-label={t.share}
              >
                <Share2 size={18} />
              </button>

              {showShareMenu && (
                <div className="share-menu">
                  <button className="share-menu-item share-whatsapp" onClick={shareWhatsApp}>
                    <MessageCircle size={16} /> {t.shareWhatsApp}
                  </button>
                  <button className="share-menu-item share-twitter" onClick={shareTwitter}>
                    <Twitter size={16} /> {t.shareTwitter}
                  </button>
                  <button className="share-menu-item share-facebook" onClick={shareFacebook}>
                    <Facebook size={16} /> {t.shareFacebook}
                  </button>
                  <button className="share-menu-item share-copy" onClick={copyToClipboard}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? t.copied : t.copyVerse}
                  </button>
                </div>
              )}
            </div>

            <button
              className={'favorite-btn ' + (favorited ? 'favorited' : '')}
              onClick={() => onToggleFavorite(currentVerse)}
              title={favorited ? t.removeFavorite : t.addFavorite}
              aria-label={favorited ? t.removeFavorite : t.addFavorite}
            >
              <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <blockquote className="verse-text">
          "{currentVerse.text}"
        </blockquote>
        <cite className="verse-reference">
          — {currentVerse.reference}
        </cite>
      </div>

      {dailyAttribute && (
        <GodAttributeCard attribute={dailyAttribute} t={t} />
      )}
    </div>
  )
}
