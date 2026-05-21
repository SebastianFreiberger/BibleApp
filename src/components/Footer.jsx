import { Crown, Heart } from 'lucide-react'
import { useLang } from '../context/LangContext'

export function Footer() {
  const { lang } = useLang()
  const es = lang === 'es'

  return (
    <footer className="landing-footer">
      <div className="landing-footer-center">
        <span className="landing-footer-brand">BibleApp</span>
        <Crown size={13} className="landing-footer-crown" />
        <span className="landing-footer-made">
          {es ? 'Hecho con' : 'Made with'}{' '}
          <Heart size={12} fill="currentColor" className="landing-footer-heart" />{' '}
          {es ? 'para tu fe' : 'for your faith'}
        </span>
      </div>
    </footer>
  )
}
