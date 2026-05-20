import { Link } from 'react-router-dom'
import { Crown, Sparkles, ChevronRight } from 'lucide-react'

export function GodAttributeCard({ attribute, t, lang = 'es' }) {
  if (!attribute) return null

  const seeMoreText = lang === 'es' ? 'Ver más' : 'See more'

  return (
    <div className="god-attribute-banner">
      <div className="attribute-glow"></div>
      <div className="attribute-inner">
        <div className="attribute-crown">
          <Crown size={24} />
        </div>
        <div className="attribute-main">
          <span className="attribute-prefix">{t.todayRemember}</span>
          <span className="attribute-name">{attribute.name}</span>
        </div>
        <Link to={`/attributes?lang=${lang}`} className="attribute-see-more">
          <span>{seeMoreText}</span>
          <ChevronRight size={16} />
        </Link>
        <div className="attribute-sparkle">
          <Sparkles size={18} />
        </div>
      </div>
      <div className="attribute-tooltip">
        <p className="tooltip-description">{attribute.description}</p>
      </div>
    </div>
  )
}
