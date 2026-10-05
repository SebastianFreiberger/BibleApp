import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { useLang } from '../context'
import { PRIVACY_POLICY } from '../data/privacyPolicy'

export function PrivacyPage() {
  const { lang } = useLang()
  const content = PRIVACY_POLICY[lang] || PRIVACY_POLICY.es
  const es = lang === 'es'

  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="auth-back">
          <ArrowLeft size={16} />
          {es ? 'Volver al inicio' : 'Back to home'}
        </Link>

        <div className="legal-header">
          <ShieldCheck size={40} className="legal-header-icon" />
          <h1>{es ? 'Privacidad' : 'Privacy'}</h1>
          <p className="legal-updated">
            {es ? 'Última actualización' : 'Last updated'}: {content.updatedAt}
          </p>
        </div>

        <p className="legal-intro">{content.intro}</p>

        {content.sections.map((section, i) => (
          <section key={i} className="legal-section">
            <h2>{section.title}</h2>
            {section.body.map((paragraph, j) => (
              <p key={j}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
