import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllAttributes, UI_TEXT } from '../data'
import { useAttributeVerse } from '../hooks'
import { useLang } from '../context'
import { Footer } from '../components'
import {
  ArrowLeft, Crown, Shield, Heart, Sparkles, Scale, Zap, Globe, Gift,
  HeartPulse, CloudSun, Clock, Eraser, ShieldCheck, Lightbulb, Palette,
  Infinity, ThumbsUp, Users, KeyRound, Sun, Wheat, Home, Mountain,
  BookOpen, Gem, Anchor, Star, RefreshCw, Sunrise, Cross, HandHeart,
  ChevronLeft, ChevronRight, Loader
} from 'lucide-react'

const ICONS = {
  Shield, Heart, HandHeart, Sparkles, Scale, Zap, Globe, Gift, HeartPulse,
  CloudSun, Clock, Eraser, ShieldCheck, Lightbulb, Palette, Infinity,
  ThumbsUp, Users, KeyRound, Sun, Wheat, Home, Mountain, BookOpen,
  Gem, Anchor, Crown, Star, RefreshCw, Sunrise, Cross
}

export function AttributesPage() {
  const { lang, bibleVersion } = useLang()
  const [selectedAttribute, setSelectedAttribute] = useState(null)
  const { loading, loadVerse, goToPrevious, goToNext, getCurrentVerse, getNavInfo } = useAttributeVerse()

  const attributes = getAllAttributes(lang)

  const t = UI_TEXT[lang] || UI_TEXT.es

  // Limpiar selección al cambiar idioma o versión para forzar recarga
  useEffect(() => {
    setSelectedAttribute(null)
  }, [lang, bibleVersion])

  // Cargar versículo cuando se selecciona un atributo
  useEffect(() => {
    if (selectedAttribute && !getCurrentVerse(selectedAttribute.id)) {
      loadVerse(selectedAttribute, lang, bibleVersion)
    }
  }, [selectedAttribute, lang, bibleVersion])

  const handleSelectAttribute = (attr) => {
    if (selectedAttribute?.id === attr.id) {
      setSelectedAttribute(null)
    } else {
      setSelectedAttribute(attr)
    }
  }

  const handleNewVerse = () => {
    if (selectedAttribute && !loading) {
      loadVerse(selectedAttribute, lang, bibleVersion)
    }
  }

  const handlePrevious = () => {
    if (selectedAttribute) {
      goToPrevious(selectedAttribute.id)
    }
  }

  const handleNext = () => {
    if (selectedAttribute) {
      goToNext(selectedAttribute.id)
    }
  }

  const IconComponent = ({ iconName, size = 32 }) => {
    const Icon = ICONS[iconName]
    return Icon ? <Icon size={size} /> : <Star size={size} />
  }

  const currentVerse = selectedAttribute ? getCurrentVerse(selectedAttribute.id) : null
  const navInfo = selectedAttribute ? getNavInfo(selectedAttribute.id) : { hasPrevious: false, hasNext: false, current: 0, total: 0 }

  return (
    <div className="attributes-page">
      <div className="attributes-bg-effects">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="light-rays"></div>
      </div>

      <header className="attributes-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={20} />
          <span>{t.backBtn}</span>
        </Link>
        <div className="header-content">
          <Crown size={40} className="header-crown" />
          <h1>{t.attributesTitle}</h1>
          <p>{t.attributesSubtitle}</p>
        </div>
      </header>

      <p className="explore-hint">{t.clickToExplore}</p>

      <div className="attributes-grid">
        {attributes.map((attr, index) => (
          <div
            key={attr.id}
            className={`attribute-card ${selectedAttribute?.id === attr.id ? 'selected' : ''} ${attr.darkText ? 'dark-text' : ''}`}
            style={{
              background: attr.gradient,
              animationDelay: `${index * 0.05}s`
            }}
            onClick={() => handleSelectAttribute(attr)}
          >
            <div className="card-glow" style={{ background: attr.color }}></div>
            <div className="card-icon">
              <IconComponent iconName={attr.icon} size={28} />
            </div>
            <span className="card-name">{attr.name}</span>
          </div>
        ))}
      </div>

      {selectedAttribute && (
        <div className="attribute-modal" onClick={() => setSelectedAttribute(null)}>
          <div
            className="modal-content"
            style={{ borderColor: selectedAttribute.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-glow" style={{ background: selectedAttribute.gradient }}></div>
            <div
              className="modal-icon"
              style={{ background: selectedAttribute.gradient }}
            >
              <IconComponent iconName={selectedAttribute.icon} size={48} />
            </div>
            <h2>
              <span className="modal-prefix">{t.godIs}</span>
              <span className="modal-name" style={{ color: selectedAttribute.color }}>
                {selectedAttribute.name}
              </span>
            </h2>
            <p className="modal-description">{selectedAttribute.description}</p>

            {loading && !currentVerse ? (
              <div className="modal-verse-loading">
                <Loader size={20} className="spinner-icon" />
                <span>{t.loading}</span>
              </div>
            ) : currentVerse ? (
              <>
                <div className="modal-verse">
                  <BookOpen size={18} />
                  <span>"{currentVerse.text}"</span>
                </div>
                <p className="modal-reference">— {currentVerse.reference}</p>

                {navInfo.total > 1 && (
                  <div className="verse-nav">
                    <button
                      className="verse-nav-btn"
                      onClick={handlePrevious}
                      disabled={!navInfo.hasPrevious}
                      aria-label="Previous verse"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="verse-nav-count">
                      {navInfo.current} {t.verseCount} {navInfo.total}
                    </span>
                    <button
                      className="verse-nav-btn"
                      onClick={handleNext}
                      disabled={!navInfo.hasNext}
                      aria-label="Next verse"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : null}

            <button
              className="modal-new-verse"
              style={{ background: selectedAttribute.gradient }}
              onClick={handleNewVerse}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={16} className="spinner-icon" />
                  {t.loading}
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  {t.newVerse}
                </>
              )}
            </button>

            <button
              className="modal-close"
              style={{ background: selectedAttribute.gradient }}
              onClick={() => setSelectedAttribute(null)}
            >
              {lang === 'es' ? 'Amén' : 'Amen'}
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
