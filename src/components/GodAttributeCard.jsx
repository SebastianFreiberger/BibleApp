import { Link } from 'react-router-dom'
import { Crown, Sparkles } from 'lucide-react'
import { useLang } from '../context/LangContext'

export function GodAttributeCard({ attribute, t }) {
  const { lang } = useLang()
  if (!attribute) return null

  const seeMoreText = lang === 'es' ? 'Ver más' : 'See more'

  const titleText = lang === 'es' ? 'Conocé más sobre Dios' : 'Learn more about God'

  return (
    <div className="god-attribute-wrapper">
      <p className="god-attribute-label">{titleText}</p>
      <Link to="/attributes" className="god-attribute-banner">
        <div className="attribute-glow"></div>
        <div className="attribute-inner">
          <div className="attribute-crown">
            <Crown size={24} />
          </div>
          <div className="attribute-main">
            <span className="attribute-prefix">{t.todayRemember}</span>
            <span className="attribute-name">{attribute.name}</span>
          </div>
          <div className="attribute-sparkle">
            <Sparkles size={18} />
          </div>
        </div>
        <div className="attribute-tooltip">
          <p className="tooltip-description">{attribute.description}</p>
        </div>
      </Link>
    </div>
  )
}
